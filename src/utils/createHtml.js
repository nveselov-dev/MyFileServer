function createHtml(files) {
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

module.exports = { createHtml };