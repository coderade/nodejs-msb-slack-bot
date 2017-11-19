const request = require('superagent');


module.exports.process = (intentData, cb) => {
    if (intentData.intent[0].value !== 'time')
        return cb(new Error(`Èxpected time intent, got ${intentData.intent[0].value}`));
    if (!intentData.location)
        return cb(new Error('Missing location intent'));

    const location = intentData.location[0].value;

    request(`http://localhost:3010/service/${location}`, (err, res) => {
        if (err || res.statusCode !== 200 || !res.body.result) {
            console.log(err);
            console.log(`body: ${res.body}`);

            return cb(false, `I had a problem finding out the time in ${location}`);
        }

        return cb(false, `In ${location}, is now ${res.body.result}`);
    });
};