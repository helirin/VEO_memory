//app 5
const http = require('http');
const fs = require('fs');

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
        
            <form action="add-note" method="POST">
            <input type="text" name="note">
            <button type="submit">Add note</button>
            </form>
            </body>
        </html>
        `);
        res.statusCode = 200;  //Ok
        res.end();
        return;                 //return tai else
    }
    else if(url === '/add-note'){
        console.log('/add-note');
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {          //kuuntelija
            const body = Buffer.concat(chunks); //yhdistää datapalat
            console.log(body);
            res.statusCode = 303;     //redirect
            res.setHeader('Location', '/');
            res.end();
        });
        return;
    }
   
    //jos mennään sivulle, jota ei ole
    console.log(`${url} not found`);
    res.write(`
    <html>
        <head><title>MemoApp</title></head>
        <body>
        
            <h1>404 - page not found</h1>
        </body>
        </html>
    `);
    res.statusCode = 404;
    res.end();
});

server.listen(8080);