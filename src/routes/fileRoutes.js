const { Router } = require('express');
const { checkFile, listFiles } = require('../utils/fileUtils.js');
const { createFilesHtml, createJokesHtml, createCatImageHtml } = require('../utils/htmlUtils.js');
const {createWeatherHtml} = require("../utils/htmlUtils");

const router = Router();
router.get('/weather', async (req, res) => {
    try {
        const geoResponse = await fetch('http://ip-api.com/json/');
        const geoData = await geoResponse.json();

        if (geoData.status === 'fail') {
            throw new Error(`Не удалось определить местоположение: ${geoData.message}`);
        }

        const city = geoData.city || 'Неизвестный город';
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
        console.error('Weather Error');
        console.error(err);
        res.status(500).send(`
            <h1>Ошибка загрузки погоды</h1>
            <p style="color: red;"><strong>${err.message}</strong></p>
            <br>
            <a href="/">Назад</a>
        `);
    }
});
router.get('/jokes', async (req, res) => {
    try {
        const response = await fetch("https://www.anekdot.ru/random/anekdot/");
        const srcHtml = await response.text();

        const dstHtml = createJokesHtml(srcHtml);

        res.send(dstHtml);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/cat', async (req, res) => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        const data = await response.json();
        const catImageUrl = data[0].url;

        const html = createCatImageHtml(catImageUrl);

        res.send(html);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = await checkFile(filename);

        if (filepath === null) {
            return res.status(404).json({ error: 'File not found' }); 
        }

        res.sendFile(filepath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const files = await listFiles();
        const html = createFilesHtml(files);

        res.send(html);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})



module.exports = router;