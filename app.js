const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect mongoDB database
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

// Schemas

const userSchema = {
    email: String,
    password: String,
};

// Declare a User and use with userSchema

const User = new mongoose.model('User', userSchema);

app.get('/', (_req, res) => {
    res.render('home');
});

app.get('/login', (_req, res) => {
    res.render('login');
});
app.get('/register', (_req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
