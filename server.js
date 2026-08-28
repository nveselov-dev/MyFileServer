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

app.use(ensureAuthenticated);

app.use('/', router);

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    const status = err.status || 500;
    const errorMessage = 'Internal Server Error';

    res.status(status).send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Ошибка ${status}</title></head>
        <body>
            <h1>Произошла ошибка</h1>
            <p style="color: red;">${errorMessage}</p>
            <a href="/">На главную</a>
        </body>
        </html>
    `);
});

app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>404</title></head>
        <body>
            <h1>Страница не найдена</h1>
            <a href="/">На главную</a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});