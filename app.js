require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const sessions = require('express-session');
const connectDB = require('./server/config/db');

const app = express();
const port = 5000 || process.env.PORT; // locally port is 5000 but if we try to post this on server than we'll use the port provided by the server.

// connect to DB
connectDB();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'))

// also let's set Static folder
app.use(express.static('public'));

// Express sessions
app.use(sessions({
    resave: false,
    saveUninitialized: false,
    secret: "you know my secret right? ",
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));
// flash messages
app.use(flash({ sessionKeyName: 'flashMessage'}));

// let's now also setup templating engines
app.use(expressLayouts);
app.set('layout', './layouts/main'); // setted the main.js as the main or default layout for all, we can change for other fies if we needed.
app.set('view engine', 'ejs'); // setting ejs view engine

// routes
app.use('/', require('./server/routes/customer'));

// Handle 404
app.get('*', (req, res)=>{
    res.status(404).render('404');
})

app.listen(port, ()=> {
    console.log(`server is running on port: ${port}`);
})