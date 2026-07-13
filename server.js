const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// পাবলিক ফোল্ডার থেকে ওয়েবসাইট দেখানোর ব্যবস্থা
// আপনার index.html ফাইলটি 'public' নামক একটি ফোল্ডারে রাখুন
app.use(express.static('public'));

// লোকেশন জমা রাখার জন্য একটি ভেরিয়েবল
let latestLocation = { lat: 22.5726, lng: 88.3639 }; // ডিফল্ট লোকেশন

// ১. অ্যান্ড্রয়েড অ্যাপ থেকে ডাটা নেওয়ার জন্য (API Endpoint)
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

// ২. ওয়েবসাইট থেকে লোকেশন চেক করার জন্য
app.get('/get-location', (req, res) => {
    res.json(latestLocation);
});

// সার্ভার চালু করা
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
