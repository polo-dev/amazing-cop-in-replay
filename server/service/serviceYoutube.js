'use strict'
var querystring = require('querystring');

class serviceYoutube {

    constructor() {

    }

    searchListByKeyword(requestData, service) {
        
    }

    removeEmptyParameters(params) {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    }
}

module.exports = serviceYoutube