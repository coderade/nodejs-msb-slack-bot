const request = require('superagent');

let handleWitResponse = (res) => {
    return res.entities;
};

class WitClient {
    constructor(token) {
        this._token = token;
    }

    ask(message, cb) {
        request.get('https://api.wit.ai/message')
            .set('Authorization', 'Bearer ' + this._token)
            .query({v: '20171119'})
            .query({q: message})
            .end((err, res) => {
                if (err)
                    return cb(err);
                if (res.statusCode !== 200)
                    return cb(`Expected status 200 but got ${res.statusCode}`);
                const witResponse = handleWitResponse(res.body);

                return cb(null, witResponse);
            });
    }

}

module.exports = WitClient;