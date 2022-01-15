const request = require('superagent');

module.exports.process = async (intentData, registry, log, cb) => {
    try {
        if (intentData.intent[0].value !== 'weather') {
            throw new Error(`Expected weather intent, got ${intentData.intent[0].value}`);
        }

        if (!intentData.location) {
            throw new Error('Missing location intent');
        }

        const location = intentData.location[0].value;
        const service = registry.get('weather');

        if (!service) {
            return cb(false, 'No service available');
        }

        const res = await request.get(`http://${service.ip}:${service.port}/service/${location}`);

        if (res.status !== 200 || !res.body.result) {
            log.error(`Error finding out the weather in ${location}: ${res.error || 'Unknown error'}`);
            return cb(false, `I had a problem finding out the weather in ${location}`);
        }

        return cb(false, `The current weather in ${location} is ${res.body.result}`);
    } catch (err) {
        log.error(err);
        return cb(false, `I had a problem processing the weather intent`);
    }
};