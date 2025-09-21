require('dotenv').config();
// Add this near your other 'require' statements
const mongoose = require('mongoose');

// Replace this with your actual connection string from MongoDB Atlas
const connectionString = process.env.DATABASE_URL;
// Connect to MongoDB
mongoose.connect(connectionString)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Schema (the blueprint for our tasks)
const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Create a Model from the Schema
// The model is what we use to interact with the database
const Task = mongoose.model('Task', taskSchema);
// 1. Import the Express framework
const express = require('express');

// 2. Create an instance of the server
const app = express();
app.use(express.json()); // This lets your server read JSON from the frontend
app.use(express.static('public')); // This serves your HTML, CSS, and JS files

// 3. Define a port for the server to listen on
const port = 3000;
// A "mock" database - a simple array of task objects
const tasks = [
    { id: 1, text: "Learn HTML", completed: true },
    { id: 2, text: "Learn CSS", completed: true },
    { id: 3, text: "Learn JavaScript", completed: false }
];

// GET route to fetch all tasks
// This is the endpoint our frontend will call
// NEW GET route to fetch all tasks from the database
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetches all documents from the Task collection
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Sends an error response if something goes wrong
    }
});
// POST route to add a new task
// NEW POST route to save a task to the database
app.post('/api/tasks', async (req, res) => {
    // Create a new task instance using our Task model
    const task = new Task({
        text: req.body.text
        // We don't need to specify 'completed'; it defaults to false from our Schema
    });

    try {
        const newTask = await task.save(); // Save the instance to the database
        res.status(201).json(newTask); // Respond with the newly created task
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle errors, like missing 'text'
    }
});

// DELETE route to remove a task by its ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 4. Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});