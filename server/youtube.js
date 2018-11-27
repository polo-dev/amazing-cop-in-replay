var express = require('express'); // Express web server framework
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
const baseUrl = 'https://api.spotify.com/';
var serviceYoutube = require('./service/serviceYoutube.js');
var api_key = process.env.API_KEY_YOUTUBE;

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

const youtube = google.youtube_v3({
    version: 'v3',
    auth: api_key
});

router.get('/youtube/search', function (req, res) {
    var params = (req.query.params) ? req.query.params : null
    serviceYoutube.searchListByKeyword(params, youtube)
})