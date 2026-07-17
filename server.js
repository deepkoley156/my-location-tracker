const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gemini API Setup (Render Environment Variable থেকে API Key নেবে)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Location Storage
let currentLocation = {
    lat: null,
    lng: null,
    timestamp: null
};

// 1. Root Endpoint
app.get('/', (req, res) => {
    res.send("Megha's Tracker Server is Running Perfectly! ❤️");
});

// 2. Update Location Endpoint (GPS Logger থেকে ডাটা রিসিভ করার জন্য)
app.post('/update-location', (req, res) => {
    const { lat, lng } = req.body;
    if (lat && lng) {
        currentLocation = {
            lat: lat,
            lng: lng,
            timestamp: new Date().toISOString()
        };
        console.log('New location received:', currentLocation);
        res.status(200).send('Location updated successfully');
    } else {
        res.status(400).send('Invalid location data');
    }
});

// 3. Get Location Endpoint (ম্যাপে দেখানোর জন্য)
app.get('/get-location', (req, res) => {
    res.json(currentLocation);
});

// 4. Chatbot Endpoint (মেঘার স্পেশাল বট)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // মডেল আপডেট করা হয়েছে: gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // বটের জন্য নির্দেশিকা 
        const prompt = `
            You are a sweet, caring, and loving AI assistant created by Pradip specially for his girlfriend, Megha. 
            Pradip loves Megha very much. Remember their beautiful 10-chapter love story and their special "143" (I Love You) moment.
            Keep your answers short, calm, and highly affectionate in Bengali. Never cause her any stress. Always make her feel special and safe.
            
            Megha's message: "${userMessage}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error Details:", error);
        // কোনো সমস্যা হলে মেঘা এই মেসেজটি দেখবে
        res.json({ reply: "একটু সমস্যা হচ্ছে মেঘা, আরেকবার বলবে? ❤️" });
    }
});

// Server Listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
