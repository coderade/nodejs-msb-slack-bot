const request = require('superagent');


module.exports.process = (intentData, registry, log, cb) => {
    if (intentData.intent[0].value !== 'time')
        return cb(new Error(`Èxpected time intent, got ${intentData.intent[0].value}`));
    if (!intentData.location)
        return cb(new Error('Missing location intent'));

    const location = intentData.location[0].value;
    const service = registry.get('time');

    if (!service)
        return cb(false, 'No service available');

    request(`http://${service.ip}:${service.port}/service/${location}`)
        .set('X-BOT-SERVICE-TOKEN', service.accessToken)
        .end((err, res) => {
            if (err || res.statusCode !== 200 || !res.body.result) {
                log.error(err);

                return cb(false, `I had a problem finding out the time in ${location}`);
            }

            return cb(false, `In ${location}, is now ${res.body.result}`);
        });
};