function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function createNavHtml() {
    return `
        <nav>
            <a href="/">Файлы</a> | 
            <a href="/weather">Погода</a> | 
            <a href="/cat">Котик</a> | 
            <a href="/jokes">Анекдоты</a>
        </nav>
        <hr>
    `;
}

function createMainPageHtml(files) {
    const links = files
        .map(file => `<li><a href="/${encodeURIComponent(file)}">${escapeHtml(file)}</a></li>`)
        .join('\n');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Главная страница</title>
        </head>
        <body>
            ${createNavHtml()}
            
            <h1>Доступные файлы:</h1>
            <ul>
                ${links || '<li>Файлы отсутствуют</li>'}
            </ul> 
        </body>
        </html>
    `;
}

function createCatImageHtml(catImageUrl) {
    const html = `
        <DOCTYPE! html>
        <html>
        <head>
            <title>Cat</title>\
        </head>
        <body>
            <img src="${catImageUrl}" alt ="Random cat" width="400">
        </body>
        </html>`;

    return html;
}

function createWeatherHtml(weatherData, city) {
    const temp = Math.round(weatherData.current_weather.temperature);
    const windSpeed = weatherData.current_weather.windspeed;

    const weatherCode = weatherData.current_weather.weathercode;
    let description = 'Ясно';
    if (weatherCode > 0 && weatherCode <= 3) description = 'Облачно';
    else if (weatherCode >= 45 && weatherCode <= 48) description = 'Туман';
    else if (weatherCode >= 51 && weatherCode <= 67) description = 'Дождь';
    else if (weatherCode >= 71 && weatherCode <= 77) description = 'Снег';
    else if (weatherCode >= 95) description = 'Гроза';

    const iconUrl = `https://openweathermap.org/img/wn/${weatherCode < 3 ? '01d' : weatherCode < 50 ? '03d' : '10d'}@2x.png`;

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Погода</title>
            </head>
            <body>
                <h1>Погода в городе: ${city}</h1>
                <img src="${iconUrl}" alt="Погодная иконка" width="100">
                <h2>Температура: ${temp}°C</h2>
                <p><strong>Описание:</strong> ${description}</p>
                <p><strong>Ветер:</strong> ${windSpeed} км/ч</p>
                <br>
                <a href="/">Назад к файлам</a>
            </body>
            </html>
        `;

    return html;
}

module.exports = {
    createMainPageHtml,
    createCatImageHtml,
    createWeatherHtml,
    createNavHtml,
    escapeHtml
};