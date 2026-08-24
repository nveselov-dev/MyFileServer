const express = require('express');
const path = require('path');
const router = require("./fileRoutes");

module.exports = function(authService) {
    const router = express.Router();

    router.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, '../../views/register.html'));
    });

    router.post('/register', async (req, res) => {
        try {
            const { username, password } = req.body;

            await authService.register(username, password);
        } catch (error) {
            res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"><title>Ошибка регистрации</title></head>
                <body>
                    <h1>Ошибка регистрации</h1>
                    <p style="color: red;">${error.message}</p>
                    <a href="/register">Попробовать снова</a> | 
                    <a href="/login">Войти</a>
                </body>
                </html>
            `);
        }
    });

    router.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../../views/login.html'));
    });

    router.post('/login', async (req, res, next) => {
        authService.passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login?error=true'
        })(req, res, next);
    });

    router.get('/logout', (req, res) => {
        req.logout((err) => {
            if (err) {
                console.error('Logout failure', err);
            }
            res.redirect('/login');
        });
    });

    return router;
}
