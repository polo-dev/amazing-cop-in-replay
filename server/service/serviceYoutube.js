'use strict'
var querystring = require('querystring');

class serviceYoutube {

    constructor() {

    }

    searchListByKeyword(auth, requestData, service) {
        var parameters = this.removeEmptyParameters(requestData['params']);
        service.search.list(parameters, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            console.log(response);
        });
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