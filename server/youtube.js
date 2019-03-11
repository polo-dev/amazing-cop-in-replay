var express = require('express'); // Express web server framework
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
var serviceYoutube = require('./service/serviceYoutube.js');
var api_key = process.env.API_KEY_YOUTUBE;
var client_secret = process.env.CLIENT_SECRET_GOOGLE
var client_id = process.env.CLIENT_ID_GOOGLE
var redirect_url = process.env.URL_REDIRECT_GOOGLE
let apiAuthUrl = '/api/youtube/login'

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

router.get('/youtube/login', async function(req, res) {    
    res.redirect(await getAuthUrl());
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
        res.clearCookie('tokens_google')
        res.redirect('/#');
    }
});


router.get('/youtube/search', async function (req, res) {
    console.log(req.cookies.access_token)
    console.log(req.cookies.tokens_google)

    var params = (req.query.params) ? req.query.params : null
    let token = (req.cookies.tokens_google) ? req.cookies.tokens_google : null

    await authorize(token, {'params': {'maxResults': '10',
        'part': 'snippet',
        'q': params,
        'type': 'video'}}, searchListByKeyword, res);
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {string} token The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(token, requestData, callback, res) {
    console.log(token);
    if (!token || Date.now() > token.expiry_date) {
        console.log('token expiry or token missing')
        res.send({
            redirectUrl: apiAuthUrl,
            error: true
        });
        return;
    }

    oauth2Client.setCredentials(token);
    callback(requestData, res);
}

async function getAuthUrl() {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: scopes
    });
    return authUrl
}
/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

async function searchListByKeyword(requestData, res) {
    var parameters = removeEmptyParameters(requestData['params']);
    youtube.search.list(parameters, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            res.clearCookie('tokens_google')
            res.send({
                error: true, 
                redirectUrl: apiAuthUrl
            })
            return;
        }
        console.log(response.data);
        res.send({
            items: response.data
        })
    });
  }

module.exports = router;