const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// এই রুটটি আপনার লোকেশন রিসিভ করবে
app.get('/update', (req, res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;

    if (lat && lng) {
        console.log(`[DATA RECEIVED] Latitude: ${lat}, Longitude: ${lng}`);
        res.status(200).send("Location received successfully!");
    } else {
        res.status(400).send("Missing parameters");
    }
});

// সার্ভারটি চলছে কি না বোঝার জন্য
app.get('/', (req, res) => {
    res.send("Server is running! The tracker is ready.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
