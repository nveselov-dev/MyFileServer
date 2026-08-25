class AuthService {
    constructor(userRepository, passport) {
        this.userRepository = userRepository;
        this.passport = passport;
    }

    async register(username, password, confirmPassword) {
        if (!username || !password || !confirmPassword) {
            throw new Error('Username and password are required');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        return await this.userRepository.create(username, password);
    }

    async changePassword(userId, oldPassword, newPassword, confirmNewPassword){
        if (newPassword !== confirmNewPassword) {
            throw new Error('Passwords do not match');
        }

        if (newPassword === oldPassword) {
            throw new Error('New password require');
        }
        const user = await this.userRepository.findById(userId);

        if (!user || !await this.userRepository.validatePassword(oldPassword, user.passwordHash)) {
            throw new Error('Invalid username or password');
        }

        return await this.userRepository.updatePassword(userId, newPassword);
    }

    setupPassport() {
        const LocalStrategy = require('passport-local').Strategy;

        this.passport.use(new LocalStrategy(async (username, password, done) => {
            try {
                const user = await this.userRepository.findByUsername(username);

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