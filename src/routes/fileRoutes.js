const { Router } = require('express');
const { checkFile, listFiles } = require('../utils/fileUtils.js');
const { createMainPageHtml, createCatImageHtml, createWeatherHtml, createNavHtml, escapeHtml } = require('../utils/htmlUtils.js');

const router = Router();

function renderError(res, statusCode, message) {
    res.status(statusCode).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Ошибка ${statusCode}</title>
        </head>
        <body>
            ${createNavHtml()}
            <h1>Ошибка ${statusCode}</h1>
            <p style="color: red;">${escapeHtml(message)}</p>
            <br>
            <a href="/">На главную</a>
        </body>
        </html>
    `);
}

router.get('/', async (req, res) => {
    try {
        const files = await listFiles();
        const html = createMainPageHtml(files);
        res.send(html);
    } catch (err) {
        console.error('Error listing files:', err);
        renderError(res, 500, 'Внутренняя ошибка сервера при чтении файлов');
    }
});

router.get('/weather', async (req, res) => {
    try {
        const geoResponse = await fetch('http://ip-api.com/json/');
        if (!geoResponse.ok) throw new Error('Ошибка гео-сервиса');

        const geoData = await geoResponse.json();
        if (geoData.status === 'fail') {
            throw new Error(`Не удалось определить местоположение: ${geoData.message}`);
        }

        const city = escapeHtml(geoData.city || 'Неизвестный город');
        const lat = geoData.lat;
        const lon = geoData.lon;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error('Ошибка при получении данных о погоде');
        }

        const weatherData = await weatherResponse.json();
        const html = createWeatherHtml(weatherData, city);

        res.send(html);
    } catch (err) {
        console.error('Weather Error:', err);
        renderError(res, 500, 'Не удалось загрузить данные о погоде');
    }
});

router.get('/cat', async (req, res) => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        if (!response.ok) {
            throw new Error('Ошибка при получении изображения кота');
        }
        const data = await response.json();
        const catImageUrl = escapeHtml(data[0].url);

        const html = createCatImageHtml(catImageUrl);
        res.send(html);
    } catch (err) {
        console.error('Cat Error:', err);
        renderError(res, 500, 'Не удалось загрузить изображение кота');
    }
});

router.get('/jokes', async (req, res) => {
    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any?amount=5");
        if (!response.ok) {
            throw new Error('Ошибка при получении анекдотов');
        }
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const jokesHtml = data.jokes.map((item, index) => {
            const jokeText = item.delivery ? `${item.setup}\n\n${item.delivery}` : item.joke;
            const safeText = escapeHtml(jokeText);
            return `<p><strong>${index + 1}.</strong> ${safeText.replace(/\n/g, '<br>')}</p><hr>`;
        }).join('\n');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Анекдоты</title>
            </head>
            <body>
                ${createNavHtml()}
                <h1>5 Случайных анекдотов:</h1>
                ${jokesHtml}
            </body>
            </html>
        `;
        res.send(html);
    } catch (err) {
        console.error('Jokes Error:', err);
        renderError(res, 500, 'Не удалось загрузить анекдоты. Попробуйте позже.');
    }
});

router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = await checkFile(filename);

        if (filepath === null) {
            return renderError(res, 404, 'Файл не найден или доступ запрещён');
        }

        res.sendFile(filepath);
    } catch (err) {
        console.error('File Error:', err);
        renderError(res, 500, 'Внутренняя ошибка сервера при чтении файла');
    }
});

module.exports = router;