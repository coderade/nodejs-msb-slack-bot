const request = require('superagent');

module.exports.process = async (intentData, registry, log, cb) => {
    try {
        if (intentData.intent[0].value !== 'time') {
            throw new Error(`Expected time intent, got ${intentData.intent[0].value}`);
        }

        if (!intentData.location) {
            throw new Error('Missing location intent');
        }

        const location = intentData.location[0].value;
        const service = registry.get('time');

        if (!service) {
            return cb(false, 'No service available');
        }

        const res = await request.get(`http://${service.ip}:${service.port}/service/${location}`)
            .set('X-BOT-SERVICE-TOKEN', service.accessToken);

        if (res.status !== 200 || !res.body.result) {
            log.error(`Error finding out the time in ${location}: ${res.error || 'Unknown error'}`);
            return cb(false, `I had a problem finding out the time in ${location}`);
        }

        return cb(false, `In ${location}, it is now ${res.body.result}`);
    } catch (err) {
        log.error(err);
        return cb(false, `I had a problem processing the time intent`);
    }
};
