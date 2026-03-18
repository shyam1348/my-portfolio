const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 1. Setup EJS (This stops the "index.html" error)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// 2. Database Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    techStack: [String],
    link: String
});
const Project = mongoose.model('Project', projectSchema);

// 3. Connect to MongoDB
// Change this:
// mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB')

// To this (Use your real Atlas string here):
mongoose.connect('mongodb+srv://shyam:yourpassword@cluster0.mongodb.net/portfolioDB?retryWrites=true&w=majority')
    .then(() => console.log("Connected to Cloud MongoDB!"))
    .catch(err => console.log(err));

// 4. THE FIX: The Route
app.get('/', async (req, res) => {
    try {
        const projects = await Project.find({});
        // This line renders views/index.ejs. It NEVER looks for index.html.
        res.render('index', { projects }); 
    } catch (err) {
        res.send("Error loading projects. Make sure MongoDB is running!");
    }
});
// 1. This route shows the form
app.get('/admin', (req, res) => {
    res.render('admin'); 
});

// 2. This route handles the data when you click 'Save'
app.post('/admin/add', async (req, res) => {
    try {
        const { title, description, techStack, link } = req.body;
        
        const newProject = new Project({
            title,
            description,
            techStack: techStack.split(',').map(s => s.trim()), // Converts "Node, CSS" to ["Node", "CSS"]
            link
        });

        await newProject.save();
        res.redirect('/'); // Go back to home to see the new project!
    } catch (err) {
        res.status(500).send("Error saving project");
    }
});
// Route to delete a project
app.post('/admin/delete/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        await Project.findByIdAndDelete(projectId); // Find the project by ID and remove it
        res.redirect('/'); // Go back home to see the updated list
    } catch (err) {
        res.status(500).send("Error deleting project");
    }
});
const nodemailer = require('nodemailer');

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Setup the "Transporter" (Who is sending the email?)
    // Note: For Gmail, you'll need an "App Password"
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shyamsundarreddy514@gmail.com', // Your email
            pass: 'ydqp wjhl eqgx tfpb'     // Your Gmail App Password
        }
    });

    // 2. Setup the Email Content
    let mailOptions = {
        from: email,
        to: 'shyamsundarreddy514@gmail.com', // Where you want to receive the mail
        subject: `New Portfolio Message from ${name}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`
    };

    // 3. Send it!
    try {
        await transporter.sendMail(mailOptions);
        res.send("<script>alert('Message Sent Successfully!'); window.location.href='/';</script>");
    } catch (error) {
        console.log(error);
        res.send("Error sending message. Check your email settings.");
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));