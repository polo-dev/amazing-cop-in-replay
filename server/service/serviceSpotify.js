'use strict'
var querystring = require('querystring');

const market = ['FR']

class serviceSpotify {

   constructor(access_token, method, limit = 20, type = 'track', offset=0) {
      this.market = market;
      this.method = method;
      this.access_token = access_token;
      this.limit = limit,
      this.type = type,
      this.offset = offset
   }

   setOffset(offset) {
         this.offset = offset
   }

   incrementOffset() {
      this.offset += this.limit
      return this.offset
   }

   getUrl(params = []) {
      let url = '';
      switch (this.method) {
            case 'playlists':
                  url = 'v1/me/playlists?' + querystring.stringify({
                        limit: this.limit,
                        offset: this.offset
                  })
                  break
            case 'check_auth':
                  url = 'v1/me'
                  break
            case 'getTracksPlaylist':
                  url = 'v1/playlists/' + params[0] + '/tracks?' + querystring.stringify({
                        limit: this.limit,
                        offset: this.offset
                  })
                  break
         default:
            url = 'v1/me/player/currently-playing'
            break
      }
      return url
   }

   getPlaylists(playlists) {
      return playlists
   }
}

module.exports = serviceSpotify