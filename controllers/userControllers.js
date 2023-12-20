//=======================================
//===== Import Dependencies         =====
//=======================================
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//=======================================
//===== Create Router               =====
//=======================================
const router = express.Router();

//=======================================
//===== Routes + Controllers        =====
//=======================================
// GET -> Signup -> /users/signup
router.get('/signup', (req, res) => {
    const { username, loggedIn, userId } = req.session;
    res.render('users/signup', { username, loggedIn, userId });
});

// POST -> Signup -> /users/signup
// this function needs to be async because we need to use bcrypt
router.post('/signup', async (req, res) => {
    //const { username, loggedIn, userId } = req.session;

    const newUser = req.body;
    
    // we need to encrypt the password, which is what we will save to the db
    // bcrypt is an encryption service
    // genSalt creates 'salt rounds' -> puts it through 10 rounds of encrypting
    //    this makes the stored password harder to hack (decrypt)
    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    );

    // we can now create our user
    User.create(newUser)
        .then(user => {
            // the new user will be created and redirected
            res.redirect('/users/login');
        })
        .catch(err => {
            console.log(err);
            //use our new error page
            res.redirect(`/error?error=${err}`);
        });
});

// GET -> Login -> /users/login
router.get('/login', (req, res) => {
    const { username, loggedIn, userId } = req.session;
    res.render('users/login', { username, loggedIn, userId });
});

// POST -> Login
router.post('/login', async (req, res) => {
    //const { username, loggedIn, userId } = req.session;

    // we can pull our credentials from the req.body
    const { username, password } = req.body;
    
    // search the db for our user
    // since our username is unique we can use that
    User.findOne({ username })
        .then(async (user) => {
            // if the user exists
            if (user) {
                // we compare the password they entered with the one we have stored
                // bcrypt will let us do this easily
                // bcrypt.compare will return either truthy or falsey
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    // passwords matched so log them in and create session
                    req.session.username = username;
                    req.session.loggedIn = true;
                    req.session.userId = user.id;

                    // redirect to home page
                    res.redirect('/');
                } else {
                    // wrong password
                    res.redirect('/error?error=something%20wrong%20with%20credentials');
                }

            } else {
                res.redirect('/error?error=user%20does%20not%20exist');
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect(`/error?error=${err}`);
        });
});

// GET -> Logout -> /users/logout
router.get('/logout', (req, res) => {
    const { username, loggedIn, userId } = req.session;
    res.render('users/logout', { username, loggedIn, userId });
});

// DELETE -> Logout
router.delete('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

//=======================================
//===== Export Router               =====
//=======================================
module.exports = router;