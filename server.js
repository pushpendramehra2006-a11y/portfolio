const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mbm_portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const Student = require('./models/Student');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        await Student.create(req.body);
        res.redirect('/students');
    } catch (err) {
        res.send("Error registering student");
    }
});

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.render('students', { students });
    } catch (err) {
        res.send("Error fetching students");
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('edit', { student });
    } catch (err) {
        res.send("Student not found");
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/students');
    } catch (err) {
        res.send("Error updating student");
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (err) {
        res.send("Error deleting student");
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});