const express = require('express');
const server = require('http').createServer(express);

const app = express();

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(3000, function() {
    console.log("server started on port 3000!!");
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    wss.clients.forEach(function each(client) {
        console.log("closing client");
        client.close();
    })

    server.close( () => {
        console.log("server closed");
        shutdownDB();
    })
})

/** Begin websockets */
const WebSocketServer = require('ws').Server;


const wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
    const numclients = wss.clients.size;
    console.log("new client connected. total clients: " + numclients);
    wss.brodcast("Current visitors: " + numclients);

    if(ws.readyState === ws.OPEN) {
        ws.send("Welcome to my server!");
    }

    db.run(`INSERT INTO visitors (count, time) VALUES (${numclients}, datetime('now'))`);


    ws.on("close", function() {
        console.log("client disconnected");
        wss.brodcast("Current visitors: " + numclients);
    });
});

wss.brodcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
            client.send(data);
    });
};
/** end websockets */


/** Begin databases */
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

db.serialize(function() {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )       
    `)
});

function getCounts() {
    db.each("SELECT * FROM visitors", function(err, row) {
        console.log(row);
    })
}

function shutdownDB() {
    getCounts();
    console.log("shutting down db...");
    db.close();
}