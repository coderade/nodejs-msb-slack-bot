const request = require('superagent');

const handleWitResponse = (res) => res.entities;

class WitClient {
    constructor(token) {
        this._token = token;
    }

    async ask(message) {
        try {
            const res = await request.get('https://api.wit.ai/message')
                .set('Authorization', `Bearer ${this._token}`)
                .query({ v: '20171119' })
                .query({ q: message });

            if (res.statusCode !== 200) {
                throw new Error(`Expected status 200 but got ${res.statusCode}`);
            }

            return handleWitResponse(res.body);
        } catch (err) {
            throw new Error(`Wit.ai request failed: ${err.message}`);
        }
    }
}

module.exports = WitClient;
