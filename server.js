const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Traccar Client অ্যাপ থেকে লোকেশন রিসিভ করার রুট
app.get('/', (req, res) => {
    const data = req.query; // Traccar অ্যাপ URL-এর মাধ্যমে ডেটা পাঠায়
    
    if (data.lat && data.lon) {
        console.log('Location received:', data);
        
        // ম্যাপের ওয়েবপেজে লোকেশন পাঠিয়ে দাও
        io.emit('locationUpdate', {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon),
            deviceId: data.id
        });
    }
    
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});