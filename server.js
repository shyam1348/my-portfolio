const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Connect to MongoDB (Local version)
mongoose.connect('mongodb://localhost:27017/portfolioDB')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log("Mongo Connection Error:", err));

// 2. Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Start the Server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});