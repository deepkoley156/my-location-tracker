const express = require('express');
const path = require('path');
const app = express(); // প্রথমে app ডিফাইন করতে হবে
const PORT = process.env.PORT || 3000;

// এবার এর নিচে সব রুট (Routes) লিখুন
app.use(express.static('public'));

let latestLocation = { lat: 22.5726, lng: 88.3639 }; 

app.get('/update', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    
    if (lat && lng) {
        latestLocation = { lat: lat, lng: lng };
        console.log(`[UPDATE] Lat: ${lat}, Lng: ${lng}`);
        res.send("Success");
    } else {
        res.status(400).send("Error: Missing Data");
    }
});

app.get('/get-location', (req, res) => {
    res.json(latestLocation);
});

// সবশেষে সার্ভার চালু হবে
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
