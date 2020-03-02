const http = require('http');
//request (req), tuleva viesti/pyyntö
//response (res), serverin vastaus
//serverin luominen
const server = http.createServer((req, res) => {
    //console.log(req);
    const url = req.url;
    const method = req.method;
    console.log(`HTTP request received: url=${url}, method=${method}`); //ei tavalliset heittomerkit
    //jos ollaan juurikansiossa, kirjoitetaan vastauksena lomake html-koodilla
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
    //jos on painettu add-note-nappulaa, työnnetään data-lohkot taulukkoon
    else if(url === '/add-note'){
        console.log('/add-note');
        const chunks = [];
        req.on('data', (chunk) => {         //otetaan data
            chunks.push(chunk);
        });

        req.on('end', () => {                   //kuuntelija
            const body = Buffer.concat(chunks); //yhdistetään datapalat buffer-luokan avulla
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