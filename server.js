const express = require('express');
const path = require('path');
const fs = require('fs'); // ফাইল চেক করার জন্য নতুন লাইব্রেরি
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    
    // ফাইলটি আছে কি না চেক করছে
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // ফাইল না পেলে লগে লিখে দিবে ঠিক কোথায় খুঁজছে
        const errorMessage = `File not found at: ${filePath}`;
        console.log(errorMessage);
        res.status(404).send(errorMessage); 
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
