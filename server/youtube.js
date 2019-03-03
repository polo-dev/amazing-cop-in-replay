var express = require('express'); // Express web server framework
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
var serviceYoutube = require('./service/serviceYoutube.js');
var api_key = process.env.API_KEY_YOUTUBE;
var client_secret = process.env.CLIENT_SECRET_GOOGLE
var client_id = process.env.CLIENT_ID_GOOGLE
var redirect_url = process.env.URL_REDIRECT_GOOGLE

var fs = require('fs');
var readline = require('readline');
const {google} = require('googleapis');
var googleAuth = require('google-auth-library');

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_url
  );


const scopes = [
    'https://www.googleapis.com/auth/youtube.force-ssl'
];

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

google.options({auth: oauth2Client});

const youtube = google.youtube({
    version: 'v3',
});

router.get('/youtube/login', function(req, res) {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'online',
        
        // If you only need one scope you can pass it as a string
        scope: scopes
        });
    
    res.redirect(url);
})

router.get('/youtube/callback', async (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
    try {
        console.log(req.query);
        const {tokens} = await  oauth2Client.getToken(req.query.code)
        console.log(tokens);
        oauth2Client.setCredentials(tokens)
        res.cookie('tokens_google', tokens)
        res.redirect('/#');
    } catch (e) {
        console.log(e)
    }
    
});


router.get('/youtube/search', async function (req, res) {
    console.log(req.cookies.access_token)
    console.log(req.cookies.tokens_google)
    oauth2Client.setCredentials(req.cookies.tokens_google);

    var params = (req.query.params) ? req.query.params : null
    let parameters = []
    parameters['part'] = 'snippet'
    parameters['maxResults'] = 25
    parameters['q'] = params
    parameters['type'] = 'video'
    youtube.search.list(parameters, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            res.send({
                items: response.data
            });
        }
        console.log(response.data);
    });
})

module.exports = router;