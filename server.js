require('@tensorflow/tfjs');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { startFaceDetection } = require('./utils');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static('public'));

startFaceDetection(wss);

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
