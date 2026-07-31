function createFilesHtml(files) {
    const links = files
    .map(file => `<li><a href="/${encodeURIComponent(file)}">${file}</a></li>`)
    .join('\n');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>List of files</title>
        </head>
        <body>
            <h1>Available files:</h1>
            <ul>
                ${links}
            </ul> 
        </body>
        </html>
    `;

    return html;
}

function createJokesHtml(src) {
    const jokes = [];
    const jokeReg = /<div[^>]*class="text"([\s\S]*?)<\/div>/gi;

    let match;

    while ((match = jokeReg.exec(src)) !== null && jokes.length < 10) {
        let jokeText = match[1];
        
        jokeText = jokeText.replace(/<[^>]*>/g, '');
        jokeText = jokeText
            .replace(/\s+/g, ' ')  
            .replace(/&nbsp;/g, ' ')  
            .trim();
            
    
        jokeText = jokeText
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'");
            
        if (jokeText) {  
                jokes.push(jokeText);
        }
    }

    const jokesHtml = jokes.map((joke, index) => 
        `<p><strong>${index + 1}.</strong> ${joke}</p><hr>`
    ).join('\n');
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jokes</title>
        </head>
        <body>
            <h1>10 Random Jokes:</h1>
            <br><br>
                ${jokesHtml}
           
        </body>
        </html>
    `;

    return html;
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

module.exports = { createFilesHtml, createJokesHtml, createCatImageHtml, createWeatherHtml };