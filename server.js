const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// Connect to MongoDB
const uri = "mongodb://127.0.0.1:27017/Clg"; // 'Clg' is your database name
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Feedback Schema & Model (this will connect to 'Feedback' collection)
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { collection: 'Feedback' }); // ✅ Force it to use your 'Feedback' collection

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API route to receive form submission
app.post('/submit-feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.json({ message: "Thank you for your feedback!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Error saving feedback." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
