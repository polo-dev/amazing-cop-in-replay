'use strict'
var querystring = require('querystring');

class serviceYoutube {

    constructor() {

    }

    searchListByKeyword(requestData, service) {
        
    }

    /**
     * Remove parameters that do not have values.
     *
     * @param {Object} params A list of key-value pairs representing request
     *                        parameters and their values.
     * @return {Object} The params object minus parameters with no values set.
     */
    removeEmptyParameters(params) {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    }

    getAllKeywordFromSpotify(tracks) {
        let keywords = [];
        tracks.forEach(theTrack => {
            let track = theTrack.track;
            if (track.track) {
                let myKeyword = track.name;
                if (typeof track.album !== 'undefined') {
                    myKeyword += ' ' + track.album.name
                }
                if (typeof track.artists !== 'undefined') {
                    track.artists.forEach(artist => {
                        myKeyword += ' ' + artist.name
                    })
                }

                keywords.push(myKeyword) 
            }
        });
        return keywords
    }
}

module.exports = serviceYoutube