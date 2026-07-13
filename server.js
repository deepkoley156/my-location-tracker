const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();

// সব ফাইলকে সরাসরি সার্ভ করে দেবে
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ট্র্যাকার থেকে ডেটা রিসিভ করা
app.get('/update', (req, res) => {
    const data = req.query;
    if (data.lat && data.lon) {
        io.emit('locationUpdate', { latitude: data.lat, longitude: data.lon });
        res.status(200).send('OK');
    } else {
        res.status(400).send('Missing lat/lon');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
