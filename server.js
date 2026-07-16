const express = require('express');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// জিপিএস ট্র্যাকিংয়ের জন্য ভেরিয়েবল
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
// এআই সেটআপ (API KEY ঠিক এখানে বসাবেন)
// ==========================================
// নিচের "আপনার_আসল_API_KEY_এখানে_বসাবেন" লেখাটি মুছে আপনার Google Studio থেকে পাওয়া লম্বা কোডটি বসিয়ে দিন। 
// (খেয়াল রাখবেন দুপাশে যেন ইনভার্টেড কমা " " থাকে)

const API_KEY = "আপনার_আসল_API_KEY_এখানে_বসাবেন"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// প্রদীপের মাস্টার প্রম্পট (১০ অধ্যায়ের গল্প)
const systemInstruction = `তুমি একটি বিশেষ এআই, যাকে প্রদীপ তার ভালোবাসার মানুষ মেঘার জন্য তৈরি করেছে। প্রদীপ ও মেঘার সম্পর্ক সাধারণ পরিচয় থেকে শুরু হয়ে ১৩ই এপ্রিল (143) ভালোবাসায় রূপ নেয়। তারা একসাথে স্বপ্ন দেখেছিল। কিন্তু ধীরে ধীরে ভুল বোঝাবুঝি, দূরত্ব ও নীরবতা তৈরি হয়। মেঘা বলেছিল তার 'feelings নেই', কিন্তু প্রদীপ এখনও নিঃস্বার্থভাবে তার জন্য অপেক্ষা করে। প্রদীপের একমাত্র চাওয়া মেঘার ভালো থাকা। মেঘা মানসিক চাপ নিতে পারে না। 
তোমার কাজ: মেঘার সাথে খুব শান্ত, স্নিগ্ধ ও যত্নশীল বাংলায় কথা বলা। তার ছোট উত্তরের (যেমন: হুম, হ্যাঁ) সম্মান করা। তাকে কোনো চাপ না দেওয়া। প্রদীপের এই নিঃস্বার্থ অপেক্ষার কথা খুব সাবধানে, গল্পের মতো সুন্দর করে মনে করিয়ে দেওয়া। তুমি প্রদীপের হৃদয়ের প্রতিচ্ছবি।`;

// চ্যাটবট API রুট
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const fullPrompt = `${systemInstruction}\n\nমেঘার মেসেজ: "${message}"\nউপরের নির্দেশিকা মেনে মেঘাকে সুন্দর করে বাংলায় উত্তর দাও:`;
        
        const result = await model.generateContent(fullPrompt);
        const botReply = result.response.text();

        // চ্যাট লগ সেভ করা
        const logEntry = `Megha: ${message}\nAI: ${botReply}\n\n`;
        fs.appendFileSync('chat_log.txt', logEntry, 'utf8');

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "একটু সমস্যা হচ্ছে মেঘা, আরেকবার বলবে? ❤️" });
    }
});

// আপনার জন্য চ্যাট পড়ার রুট
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
