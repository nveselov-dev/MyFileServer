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
module.exports = { createFilesHtml, createJokesHtml, createCatImageHtml };