//=======================================
//===== Import Dependencies         =====
//=======================================
const express = require('express');
const axios = require('axios');
const allPlacesUrl = process.env.COUNTRY_API_URL;
const nameSearchBaseUrl = process.env.C_BY_NAME_BASE_URL;

//=======================================
//===== Create Router               =====
//=======================================
const router = express.Router();

//=======================================
//===== Routes + Controllers        =====
//=======================================
// GET -> /places/all
// gives us all countries in the API for an index
router.get('/all', (req, res) => {
    const { username, loggedIn, userId } = req.session;
    // make api call
    axios(allPlacesUrl)
        // if data returned, render index page
        .then(apiRes => {
            // apiRes.data is an array of country objects
            console.log('This came back from api: \n', apiRes.data[0]);
            res.render('places/index', { places: apiRes.data, username, loggedIn, userId });
        })
        // if something goes wrong, display error page
        .catch(err => {
            console.log(err);
            //use our new error page
            res.redirect(`/error?error=${err}`);
        });
});

// GET -> /places/:name
// give us a specific country's details after searching with the name


//=======================================
//===== Export Router               =====
//=======================================
module.exports = router;