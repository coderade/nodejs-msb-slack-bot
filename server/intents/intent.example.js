const request = require('superagent');

module.exports.process = async (intentData, registry, log, cb) => {
    try {
        if (intentData.intent[0].value !== 'intent-name') {
            throw new Error(`Expected intent-name intent, got ${intentData.intent[0].value}`);
        }

        const location = intentData.location[0].value;
        const service = registry.get('intent-name'); // The name of the intent registered.

        if (!service) {
            return cb(false, 'No service available');
        }

        const res = await request.get(`http://${service.ip}:${service.port}/service/${intentData.intent[0].value}`);

        if (res.status !== 200 || !res.body.result) {
            log.error(`Error processing intent: ${res.error || 'Unknown error'}`);
            return cb(false, 'I had a problem working with this intent');
        }

        return cb(false, `In ${location}, it is now ${res.body.result}`);
    } catch (err) {
        log.error(err);
        return cb(false, `I had a problem working with this intent`);
    }
};
