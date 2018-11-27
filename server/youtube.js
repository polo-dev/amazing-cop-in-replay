var express = require('express'); // Express web server framework
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
var serviceYoutube = require('./service/serviceYoutube.js');
var api_key = process.env.API_KEY_YOUTUBE;

var fs = require('fs');
var readline = require('readline');
const {google} = require('googleapis');
var googleAuth = require('google-auth-library');

const youtube = google.youtube({
    version: 'v3',
    auth: api_key
});

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

router.get('/youtube/search', function (req, res) {
    var params = (req.query.params) ? req.query.params : null
    let parameters = []
    parameters['part'] = 'snippet'
    parameters['maxResults'] = 25
    parameters['q'] = params
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