const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ফাইলগুলো মেইন ফোল্ডার থেকেই লোড হবে
app.use(express.static(__dirname)); 

let latestLocation = { lat: 22.5726, lng: 88.3639 }; 

// অ্যাপের ডাটা রিসিভ করার জন্য
app.get('/update', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    if (lat && lng) {
        latestLocation = { lat: lat, lng: lng };
        console.log(`[UPDATE] Lat: ${lat}, Lng: ${lng}`);
        res.send("Success");
    } else {
        res.status(400).send("Missing Data");
    }
});

// ওয়েবসাইট থেকে লোকেশন দেখার জন্য
app.get('/get-location', (req, res) => {
    res.json(latestLocation);
});

// মেইন পেজ হিসেবে index.html দেখানোর জন্য
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
