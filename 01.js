const http = require('http');

const server = http.createServer((req, res) => {
    //console.log(req);
    const url = req.url;
    const method = req.method;
    console.log(`HTTP request received: url=${url}, method=${method}`); //ei tavalliset hipsut

    if(url === '/'){
        res.write(`
        <html>
        <head><title>MemoApp</title></head>
        <body>
        </body>
            <form action="add-note" method="POST">
            <input type="text" name="note">
            <button type="submit">Add note</button>
            </form>
        </html>
        `);
        res.end();
    }
});

server.listen(8080);