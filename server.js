const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

let latestLocation = { lat: 22.5726, lng: 88.3639 }; 

// ১. অ্যাপ থেকে লোকেশন রিসিভ করার কোড (এটাই মিসিং ছিল!)
app.get('/update', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    
    if (lat && lng) {
        latestLocation = { lat: lat, lng: lng };
        console.log(`[SUCCESS] New Location Received -> Lat: ${lat}, Lng: ${lng}`);
        res.send("Success");
    } else {
        res.status(400).send("Error: Missing Data");
    }
});

// ২. ম্যাপে লোকেশন পাঠানোর কোড
app.get('/get-location', (req, res) => {
    res.json(latestLocation);
});

// ৩. মেইন পেজ দেখানোর কোড
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
