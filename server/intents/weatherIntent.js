const request = require('superagent');

module.exports.process = (intentData, registry, log, cb) => {
    if (intentData.intent[0].value !== 'weather')
        return cb(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
    if (!intentData.location)
        return cb(new Error('Missing location intent'));

    const location = intentData.location[0].value;
    const service = registry.get('weather');

    if (!service)
        return cb(false, 'No service available');

    request(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
        if (err || res.statusCode !== 200 || !res.body.result) {
            log.error(err);

            return cb(false, `I had a problem finding out the weather in ${location}`);
        }

        return cb(false, `The current weather in ${location} is ${res.body.result}`);
    });
};