const video = document.getElementById('video');

async function startStreaming() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
        console.log('WebSocket connection established.');
    };

    const videoStream = new MediaStream();
    videoStream.addTrack(stream.getVideoTracks()[0]);
    const mediaRecorder = new MediaRecorder(videoStream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            socket.send(event.data);
        }
    };

    mediaRecorder.start(100);

    socket.onmessage = (event) => {
        const faceData = JSON.parse(event.data);
        console.log('msg from socket');
     //tbd
    };
}

startStreaming().catch(console.error);
