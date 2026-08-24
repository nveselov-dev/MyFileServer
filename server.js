const express = require('express');
const session = require('express-session');
const ensureAuthenticated = require('./src/middlewares/auth');
const pool = require('./src/db/db');
const router = require('./src/routes/fileRoutes');
const { PORT, SESSION_SECRET } = require('./src/config/config');
const UserRepository = require('./src/repositories/UserRepository');
const AuthService = require('./src/services/AuthService');
const passport = require("passport");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

const userRepository = new UserRepository(pool);
const authService = new AuthService(userRepository, passport);

authService.setupPassport();

const authRoutes = require("./src/routes/authRoutes")(authService);
app.use("/", authRoutes);

app.use('/', ensureAuthenticated, router);

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`)});