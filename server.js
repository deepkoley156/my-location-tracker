const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// এটা রুট ফোল্ডার থেকেই ফাইল লোড করবে, কোনো public ফোল্ডার লাগবে না
app.use(express.static(__dirname)); 

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Traccar ডেটা রিসিভ করার জন্য
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
