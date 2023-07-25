const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const { createCanvas, loadImage } = require('canvas');

async function loadModels() {
    await faceapi.nets.faceExpressionNet.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
    await faceapi.nets.tinyFaceDetector.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
};


async function handleFaceDetection(socket, data) {
    try {
        const image = new Image();
        image.onload = async () => {
            console.log('image loaded');
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            console.log('converting image');
            const faceapiCanvas = faceapi.createCanvasFromMedia(canvas);
            faceapi.matchDimensions(faceapiCanvas, canvas);
            console.log('performing face detection');
            const detections = await faceapi.detectAllFaces(faceapiCanvas).withFaceLandmarks().withFaceDescriptors();
            socket.send(JSON.stringify(detections));
        };

        image.src = data;
    } catch (error) {
        console.error('Face detection error:', error.message);
    }
};

async function startFaceDetection(wss) {
    await loadModels();
    wss.on('connection', (socket) => {
        console.log('WebSocket connected.');
        socket.on('message', async (data) => {
            await handleFaceDetection(socket, data);
        });
    });
}

module.exports = {
    startFaceDetection,
};




