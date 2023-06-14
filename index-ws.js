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
