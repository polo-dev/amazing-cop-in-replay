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

const {google} = require('googleapis');

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

router.post('/youtube/convert/spotify', async function (req, res) {
    var tracks = (req.body.tracks) ? req.body.tracks : null
    let token = (req.cookies.tokens_google) ? req.cookies.tokens_google : null

    if (!tracks) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'error missing tracks'
        }));
    }

    let serviceY = new serviceYoutube();
    let keywords = serviceY.getAllKeywordFromSpotify(tracks)
    console.log(keywords);
    let results = await asyncForEachSearch(keywords, token, res);
    let data = [];
    results.forEach(r => {
        if (r && typeof r.id !== 'undefined') {
            console.log(r.id)
            data.push(r.id.videoId)
        } else {
            console.log('error : ', r)
        }
    })
    console.log('les datas :')
    console.log(data);
    
    res.json({
        items: data
    })
    
})

async function asyncForEachSearch(keywords, token, res) {
    let results = []
    for (let index = 0; index < keywords.length; index++) {
        let result = await authorize(token, {'params': {'maxResults': '1',
        'part': 'snippet',
        'q': keywords[index],
        'type': 'video'}}, await searchListByKeywordV2, res)

        if (result)
            results.push(result[0]);
        
        if (index === keywords.length -1) {
            return results
        }
    }
  }
  
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {string} token The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(token, requestData, callback, res) {
    // console.log(token);
    if (!token || Date.now() > token.expiry_date) {
        console.log('token expiry or token missing')
        res.send({
            redirectUrl: apiAuthUrl,
            error: true
        });
        return;
    }

    oauth2Client.setCredentials(token);
    return await callback(requestData, res);
}

async function getAuthUrl() {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: scopes
    });
    return authUrl
}

async function searchListByKeywordV2(requestData) {
    let serviceY = new serviceYoutube()
    var parameters = serviceY.removeEmptyParameters(requestData['params']);
    let result = await youtube.search.list(parameters);
    return result.data.items;
}

function playlistsInsert(auth, requestData) {
    let serviceY = new serviceYoutube()
    var parameters = serviceY.removeEmptyParameters(requestData['params'])
    parameters['resource'] = createResource(requestData['properties']);
    service.playlists.insert(parameters, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log(response);
    });
  }

async function searchListByKeyword(requestData, res) {
    let serviceY = new serviceYoutube()
    var parameters = serviceY.removeEmptyParameters(requestData['params']);
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