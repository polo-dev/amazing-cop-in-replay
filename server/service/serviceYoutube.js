'use strict'
var querystring = require('querystring');

class serviceYoutube {

    constructor() {

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

    /**
     * 
     * @param {Object} tracks List of tracks with track name, track album name
     *                          and artists
     * @return {Array} list of keywords to search on youtube
     */
    getAllKeywordFromSpotify(tracks) {
        let keywords = [];
        tracks.forEach(track => {
            let myKeyword = track.name + ' ' + track.album;
            if (typeof track.artists !== 'undefined') {
                track.artists.forEach(artist => {
                    myKeyword += ' ' + artist.name
                })
            }
            keywords.push(myKeyword)
        });
        return keywords
    }

    /**
     * 
     * @param {Array} params 
     */
    getDefaultInsertPlaylist(params) {
        return {
            "part": "snippet,status",
            "resource": {
                "snippet": {
                    "title": params.name,
                    "description": "Une playlist de qualitée.",
                    "tags": [
                        params.name
                    ],
                    "defaultLanguage": "fr"
                },
                "status": {
                    "privacyStatus": params.isPublic ? "public" : "private"
                }
            }
        }
    }

    /**
     * 
     * @param {Array} params 
     * @param {string} playlistId 
     */
    getDefaultInsertTracks(params, playlistId) {
        return {
            "part": "snippet",
            "resource": {
                "snippet": {
                    "playlistId": playlistId,
                    "resourceId": {
                        "kind": params.kind,
                        "videoId": params.videoId
                    }
                }
            }
        }
    }
}

module.exports = serviceYoutube