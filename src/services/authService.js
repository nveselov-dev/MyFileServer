class AuthService {
    constructor(userRepository, passport) {
        this.userRepository = userRepository;
        this.passport = passport;
    }

    async register(username, password){
        if (!username || !password){
            throw new Error('Username and password are required');
        }

        const existingUser = await this.userRepository.findByUsername(username);
        if (!existingUser) {
            throw new Error('User already exists');
        }

        return await this.userRepository.create(username, password);
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