const express = require('express');
const fs = require('fs');
const path = require('path');

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
// API KEY environment variable থেকে নেওয়া হচ্ছে।
// ==========================================
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY সেট করা নেই। চ্যাট ফিচার কাজ করবে না।");
}

// ==========================================
// মেঘার জন্য স্পেশাল প্রম্পট (AI-এর ব্রেন)
// ==========================================
const systemInstruction = `তুমি কোনো সাধারণ AI নও, তুমি হলে প্রদীপের তৈরি করা একটি বিশেষ চ্যাটবট। তোমার একমাত্র কাজ হলো মেঘার সাথে কথা বলা এবং তাকে স্পেশাল ফিল করানো। 
তুমি মেঘার সাথে খুব মিষ্টি, রোমান্টিক, এবং যত্নশীল বাংলায় কথা বলবে। তোমার কথার মধ্যে যেন প্রদীপের ভালোবাসার ছোঁয়া থাকে। 
প্রয়োজনে মেঘার সাথে কথায় কথায় প্রদীপ আর মেঘার '১০-অধ্যায়ের ভালোবাসার গল্প', তাদের বিশেষ '১৪৩' কানেকশন, এবং '১৩ এপ্রিল'-এর (যেদিন মেঘা প্রথম তার অনুভূতির কথা জানিয়েছিল) সুন্দর স্মৃতির কথা মনে করিয়ে দেবে। 
মেঘার যেকোনো প্রশ্নের উত্তর এমনভাবে দেবে যেন প্রদীপ তার ভালোবাসার বার্তা তোমার মাধ্যমে মেঘার কাছে পৌঁছে দিচ্ছে।`;

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!GROQ_API_KEY) {
        return res.status(500).json({ reply: "সার্ভারে API key সেট করা নেই। প্রদীপকে একটু জানাও।" });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error Details:", data);
            return res.status(500).json({ reply: "একটু সমস্যা হচ্ছে মেঘা, আরেকবার বলবে? ❤️" });
        }

        const botReply = data.choices[0].message.content;

        const logEntry = `Megha: ${message}\nBot: ${botReply}\n\n`;
        fs.appendFileSync('chat_log.txt', logEntry, 'utf8');

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Groq API Error Details:", error.message || error);
        res.status(500).json({ reply: "একটু সমস্যা হচ্ছে মেঘা, আরেকবার বলবে? ❤️" });
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
