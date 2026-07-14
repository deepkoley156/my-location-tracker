const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// যদি index.html ফাইলটি মেইন ফোল্ডারেই থাকে, তবে এটি কাজ করবে
app.use(express.static(path.join(__dirname))); 

let latestLocation = { lat: 22.5726, lng: 88.3639 }; 

// অ্যাপের ডাটা নেওয়ার জন্য
app.get('/update', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    if (lat && lng) {
        latestLocation = { lat: lat, lng: lng };
        res.send("Success");
    } else {
        res.status(400).send("Missing Data");
    }
});

// ওয়েবসাইট থেকে লোকেশন দেখার জন্য
app.get('/get-location', (req, res) => {
    res.json(latestLocation);
});

// রুট ইউআরএল-এ ফাইলটি দেখানোর জন্য
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
