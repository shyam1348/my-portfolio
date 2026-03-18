const mongoose = require('mongoose');
const Project = require('./models/Project'); // This links to your schema

mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB');

const seedDB = async () => {
    // This adds a sample project to your database
    const sampleProject = new Project({
        title: "My First Full Stack Site",
        description: "Built using Node.js, Express, and MongoDB.",
        techStack: ["Node.js", "MongoDB", "EJS"],
        link: "https://github.com/shyam"
    });

    await sampleProject.save();
    console.log("Project saved to Database!");
    process.exit();
};

seedDB();