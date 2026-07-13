const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// রুট থেকে index.html সার্ভ করা
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Traccar ডেটা রিসিভ করার রুট
app.get('/update', (req, res) => {
    const data = req.query;
    if (data.lat && data.lon) {
        console.log('Location received:', data);
        io.emit('locationUpdate', {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon)
        });
    }
    res.status(200).send('OK');
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
