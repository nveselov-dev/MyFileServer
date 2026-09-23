const {
    validateUsername,
    validatePassword,
    validatePasswordsMatch,
} = require('../utils/validator');

class AuthService {
    constructor(userRepository, passport) {
        this.userRepository = userRepository;
        this.passport = passport;
    }

    async register(username, password, confirmPassword) {
        const normalizedUsername = validateUsername(username);
        validatePassword(password);
        validatePasswordsMatch(password, confirmPassword);

        try {
            return await this.userRepository.create(normalizedUsername, password);
        } catch (error) {
            throw error;
        }
    }

    async changePassword(userId, oldPassword, newPassword, confirmNewPassword) {
        if (typeof oldPassword !== 'string' || oldPassword.trim() === '') {
            const err = new Error('Current password is required');
            err.status = 400;
            throw err;
        }

        validatePassword(newPassword);

        if (typeof confirmNewPassword !== 'string' || confirmNewPassword.trim() === '') {
            const err = new Error('New password confirmation is required');
            err.status = 400;
            throw err;
        }

        if (newPassword !== confirmNewPassword) {
            const err = new Error('New passwords do not match');
            err.status = 400;
            throw err;
        }

        if (newPassword === oldPassword) {
            const err = new Error('New password must differ from current password');
            err.status = 400;
            throw err;
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }

        const isValid = await this.userRepository.validatePassword(oldPassword, user.password_hash);
        if (!isValid) {
            const err = new Error('Invalid current password');
            err.status = 400;
            throw err;
        }

        return await this.userRepository.updatePassword(userId, newPassword);
    }

    setupPassport() {
        const LocalStrategy = require('passport-local').Strategy;

        this.passport.use(new LocalStrategy(async (username, password, done) => {
            try {
                const user = await this.userRepository.findByUsername(username.trim());

                if (!user) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                const isValid = await this.userRepository.validatePassword(password, user.password_hash);
                if (!isValid) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }));

        this.passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        this.passport.deserializeUser(async (id, done) => {
            try {
                const user = await this.userRepository.findById(id);
                done(null, user);
            } catch (err) {
                done(err);
            }
        });
    }
}

module.exports = AuthService;