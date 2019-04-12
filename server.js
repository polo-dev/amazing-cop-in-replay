const { Nuxt, Builder } = require('nuxt')
var express = require('express'); // Express web server framework
var cors = require('cors');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

var app = express();

app.use(express.static(__dirname + './assets'));
app.use(cors())
 .use(cookieParser())
 .use(bodyParser.json())
 .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000, https://api.spotify.com/*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const apiSpotify = require('./server/spotify.js');
const apiYoutube = require('./server/youtube.js');

app.use('/api', [apiSpotify, apiYoutube]);
 /* eslint-disable no-console */


 const isProd = process.env.NODE_ENV === 'production';

let config = require('./nuxt.config.js');
config.dev = !isProd;

let nuxt = new Nuxt(config)

// Start build process (only in development)
const promise = (isProd ? Promise.resolve() : new Builder(nuxt).build());

promise.then(() => {
   app.use(nuxt.render);
   app.listen(3000);
   console.log('Server is listening on http://localhost:3000');
 })
 .catch((error) => {
   console.error(error);
   process.exit(1);
 });