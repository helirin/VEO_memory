//Teht. Lisää Delete-nappi, jolla voi poistaa noten. (input type=number name="index")
// Käsittele /delete-note POST pyyntö
//- notes.splice(index, 1)
const http = require('http');
const fs = require('fs');

const notes = [];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(`HTTP request received: url=${url} , method=${method}`);

    if (url === '/') {
        res.write(`
        <html>
        <head><title>MemoApp</title></head>
        <body>`);
        //haetaan laatikkoon kirjoitetut arvot
        notes.forEach((value, index) => {
            res.write(`<div>note:${value}, index: ${index}</div>`);
        });

        res.write(`<form action="add-note" method="POST">
                <input type="text" name="note">
                <button type="submit">Add note</button>
                <input type="button" onclick="alert('Hello World!')" value="Delete"> 
            </form>
        </body>
        </html>
        `);
        res.statusCode = 200; //Ok
        res.end();
        return;
    } else if (url === '/add-note') {
        console.log('/add-note');
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            const note = body.split('=')[1];
            notes.push(note);
            res.statusCode = 303; //Redirect
            res.setHeader('Location', '/');
            res.end();
        });
        return;
    } else if (url === '/favicon.ico') {
        fs.readFile('./favicon.ico', (err, data) => {
            res.write(data);
            res.end();
        });
        return;
    }

    console.log(`${url} not found`);
    res.write(`
    <html>
        <head><title>MemoApp - 404</title></head>
        <body>
            <h1>404 - page not found</h1>
        </body>
    </html>`);
    res.statusCode = 404; //Not Found
    res.end();

});

server.listen(8080)