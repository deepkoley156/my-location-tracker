const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // সব সোর্স থেকে কানেকশন অ্যালাউ করবে
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // মোবাইল থেকে লোকেশন রিসিভ করছে
    socket.on('updateLocation', (data) => {
        console.log('Location received:', data);
        // ম্যাপের ওয়েবপেজে লোকেশন পাঠিয়ে দিচ্ছে
        io.emit('locationUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
