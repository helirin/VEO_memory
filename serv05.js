//Teht. Lisää Delete-nappi jokaisen tekstinpätkän viereen
//Lisää forEach silmukassa formi, jossa delete nappi
//-intput type="hidden"value="$(index)""
//encoding 8, jotta äät käsitellään oikein
//<meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
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
        <head><title>MemoApp</title>
        <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
        </head>
        <body>`);
        //haetaan laatikkoon kirjoitetut arvot
        notes.forEach((value, index) => {
            res.write(`<div>note:${value}, index: ${index}</div>
            <form action="delete-note" method="POST">          
            <input type="hidden" name="index" value="${index}">
            <button type="submit">Delete</button> 
        </form>`)
        });

        res.write(`<form action="add-note" method="POST">
                <input type="text" name="note">
                <button type="submit">Add note</button>
            </form>
          
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
            const decoded_body =decodeURIComponent(body);   //utf-8 koodauksesta
            const note = decoded_body.split('=')[1];         //pilkotaan
            notes.push(note);
            res.statusCode = 303; //Redirect
            res.setHeader('Location', '/');
            res.end();
        });
        return;
    //käsitellään poisto
} else if (url === '/delete-note') {
    console.log('/delete-note');
    const chunks = [];
    req.on('data', (chunk) => {       //Kuunnellaan
        chunks.push(chunk);
    });
    req.on('end', () => {
        const body = Buffer.concat(chunks).toString(); 
        const index = body.split('=')[1];
        notes.splice(index,1);            //poistetaan indexin kohdasta 1 alkio
        res.statusCode = 303; //Redirect
        res.setHeader('Location', '/');
        res.end();
    });
    return;
    //käsittely päättyy
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