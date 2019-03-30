/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
var client_id = process.env.client_id; // Your client id
var client_secret = process.env.client_secret; // Your secret
var redirect_uri = process.env.redirect_uri; // Your redirect uri
var serviceSpotify = require('./service/serviceSpotify.js');
const baseUrl = 'https://api.spotify.com/';
var rp = require('request-promise');

router.get('/get', async function (req, res) {
  var access_token = req.query.access_token;
  var method = req.query.method;
  var limit = (req.query.limit) ? parseInt(req.query.limit) : null;
  var type = (req.query.type) ? req.query.type : null;
  var offset = (req.query.offset) ? parseInt(req.query.offset) : null;
  var params = (req.query.params) ? req.query.params : null;
  var total = (req.query.total) ? parseInt(req.query.total) : null;

  if (!access_token) {
    res.status(500).send('Hey we need an access_token Dev!');
  }
  if (!method) {
    res.status(500).send('Hey what\'s the name of the method dude ?');
  }
  
  let spotify = new serviceSpotify(access_token, method, limit, type, offset)
  var allAuthOptions = [];

  if (total > limit) {
    let offset = Math.ceil(total / limit)
    for (i = 0; offset > i; i++) {
      let authOptions = {
        url: baseUrl + spotify.getUrl(params),
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
      allAuthOptions[i] = authOptions
      spotify.incrementOffset()
    }
  } else {
    let authOptions = {
      url: baseUrl + spotify.getUrl(params),
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    allAuthOptions.push(authOptions)
  }

  const promises = allAuthOptions.map(options => rp(options));
  Promise.all(promises).then((data) => {
    console.log('test promises', data)
    if (data.length === 1) {
      res.send({
        items: data[0]
      })  
    } else {
      res.send({
        items: data
      })
    }
    
  })
    .catch(function (err) {
      console.log(err)
      res.clearCookie('access_token')
      res.redirect('login')
      // Crawling failed...
    });
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-read-recently-played user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;
        console.log(response, body)
        // we can also pass the token to the browser to make requests from there
        res.cookie('access_token', access_token);
        res.redirect('/#');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

router.get('/current_music', function (req, res) {
  var access_token = req.query.access_token;
  var authOptions = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  console.log(access_token);

  request.get(authOptions, function (error, response, body) {
    console.log(response.statusCode);
    if (!error && response.statusCode === 200) {
      console.log(body.item.artists);
      res.send({
        artists: body.item.artists
      });
    }

  });
});


module.exports = router;