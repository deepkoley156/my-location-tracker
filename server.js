const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path'); // নতুন লাইন

const app = express();
app.use(cors());

// ম্যাপের ফাইলটি দেখানোর জন্য
app.use(express.static(path.join(__dirname, 'public'))); 

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.get('/update', (req, res) => { // Traccar ডেটা রিসিভ করার জন্য '/update' রুট
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