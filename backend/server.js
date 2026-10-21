const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolioDB')
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('DB Connection Error:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    specialization: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Route to Register/Save User Data
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, year, branch, specialization } = req.body;
        
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, year, branch, specialization });
            await user.save();
        } else {
            user.name = name;
            user.year = year;
            user.branch = branch;
            user.specialization = specialization;
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Data saved successfully!', user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Route to Get All Users (Tabular View / Admin Dashboard)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));