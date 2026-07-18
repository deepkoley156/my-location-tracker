const express = require('express');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

let currentLocation = { lat: 0, lng: 0 };

app.get('/update', (req, res) => {
    const lat = req.query.lat || req.query.latitude;
    const lng = req.query.lon || req.query.lng || req.query.longitude;

    if (lat && lng) {
        currentLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
        console.log("New location received:", currentLocation);
        res.send("Location Updated");
    } else {
        res.send("Missing location parameters");
    }
});

app.get('/location', (req, res) => {
    res.json(currentLocation);
});

// ==========================================
// API KEY শুধুমাত্র environment variable থেকে নেওয়া হচ্ছে।
// কোডে সরাসরি key লিখবে না — বিশেষ করে এই ফাইলটা
// public static site হিসেবে সার্ভ হচ্ছে, তাই কোডে key
// থাকলে যে কেউ দেখে ফেলতে পারে।
//
// চালানোর আগে টার্মিনালে সেট করো:
//   GEMINI_API_KEY=তোমার_আসল_key node server.js
// অথবা .env ফাইল ব্যবহার করলে dotenv প্যাকেজ লাগবে।
// ==========================================
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY সেট করা নেই। চ্যাট ফিচার কাজ করবে না।");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// gemini-pro এখন deprecated — তাই আগে সব রিকোয়েস্ট ফেইল হচ্ছিল।
// এখন একটা current, supported মডেল ব্যবহার করা হলো।
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// নিরপেক্ষ, সাধারণ assistant প্রম্পট — কোনো emotional persona
// বা বারবার মনে করানোর script নেই।
const systemInstruction = `তুমি একটি সহায়ক, বন্ধুত্বপূর্ণ AI অ্যাসিস্ট্যান্ট। ব্যবহারকারীর প্রশ্নের সংক্ষিপ্ত, স্পষ্ট এবং শান্ত বাংলায় উত্তর দাও। ব্যবহারকারীর ব্যক্তিগত সিদ্ধান্ত এবং সীমারেখাকে সম্মান করো।`;

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!API_KEY) {
        return res.status(500).json({ reply: "সার্ভারে API key সেট করা নেই। অ্যাডমিনের সাথে যোগাযোগ করো।" });
    }

    try {
        const fullPrompt = `${systemInstruction}\n\nব্যবহারকারীর মেসেজ: "${message}"\nউত্তর দাও:`;

        const result = await model.generateContent(fullPrompt);
        const botReply = result.response.text();

        const logEntry = `User: ${message}\nAI: ${botReply}\n\n`;
        fs.appendFileSync('chat_log.txt', logEntry, 'utf8');

        res.json({ reply: botReply });
    } catch (error) {
        // আসল error message কনসোলে দেখা যাবে, ফলে ডিবাগ করা সহজ হবে
        console.error("Gemini API Error Details:", error.message || error);
        res.status(500).json({ reply: "একটু সমস্যা হচ্ছে, আরেকবার চেষ্টা করবে?" });
    }
});

app.get('/logs', (req, res) => {
    if (fs.existsSync('chat_log.txt')) {
        const data = fs.readFileSync('chat_log.txt', 'utf8');
        res.send(`<pre style="font-family: monospace; font-size: 16px; padding: 20px; background: #f9f9f9;">${data}</pre>`);
    } else {
        res.send("<h2 style='padding: 20px;'>এখনও কোনো কথা হয়নি...</h2>");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
