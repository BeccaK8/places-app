//=======================================
//===== Import Dependencies         =====
//=======================================
const express = require('express');  // import express framework
require('dotenv').config();          // import/load ENV variables
const path = require('path');        // import path module
const middleware = require('./utils/middleware');


//=======================================
//===== Import Routers              =====
//=======================================
const UserRouter = require('./controllers/userControllers');
const PlaceRouter = require('./controllers/placeControllers');

//==================================================
//===== Create app object + set up view engine =====
//==================================================
const app = express();               // create the express function

// view engine - ejs
app.set('views', path.join(__dirname, 'views')); // allows us to skip writing 'views' every time we want to call into the views folder
app.set('view engine', 'ejs');

//=======================================
//===== Middleware                  =====
//=======================================
middleware(app);

//=======================================
//===== Routes                      =====
//=======================================
// basic home route
app.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session;
    //res.send('the app is connected');
    res.render('home.ejs', { username, loggedIn, userId });
});
// Register my routes
app.use('/users', UserRouter);
app.use('/places', PlaceRouter);

// error page
app.get('/error', (req, res) => {
    const error = req.query.error || 'Oops! Something went wrong. Please try again.';
    const { username, loggedIn, userId } = req.session;
    //res.send(error);
    res.render('error', { error, username, loggedIn, userId });
});

//=======================================
//===== Server Listener             =====
//=======================================
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Your server is running, better go catch it');
});