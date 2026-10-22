const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB Atlas Cloud Connection String with your password
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://pushpendramehra2006_db_user:mSFObUs2s4E1fF3P@cluster0.g8bcmkf.mongodb.net/mbm_portfolio?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch(err => console.log('DB Connection Error:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const Student = require('./models/Student');

// Home Route (Portfolio)
app.get('/', (req, res) => {
    res.render('index');
});

// Register Form Route
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle Student Registration (POST)
app.post('/register', async (req, res) => {
    try {
        await Student.create(req.body);
        res.redirect('/students');
    } catch (err) {
        res.send("Error registering student");
    }
});

// Registered Students Table Route
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.render('students', { students });
    } catch (err) {
        res.send("Error fetching students");
    }
});

// Edit Student Form Route
app.get('/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('edit', { student });
    } catch (err) {
        res.send("Student not found");
    }
});

// Update Student Route (POST)
app.post('/edit/:id', async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/students');
    } catch (err) {
        res.send("Error updating student");
    }
});

// Delete Student Route
app.get('/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (err) {
        res.send("Error deleting student");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});