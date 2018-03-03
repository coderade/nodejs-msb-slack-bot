const request = require('superagent');


module.exports.process = (intentData, registry, cb) => {
    if (intentData.intent[0].value !== 'intent-name')
        return cb(new Error(`Èxpected intent-name intent, got ${intentData.intent[0].value}`));

    const location = intentData.location[0].value;

    const service = registry.get('intent-name'); //The name of intent registered.

    if (!service)
        return cb(false, 'No service available');

    request(`http://${service.ip}:${service.port}/service/${intentData.intent[0].value}`, (err, res) => {
        if (err || res.statusCode !== 200 || !res.body.result) {
            console.log(err);

            return cb(false, `I had a problem working with this intent`);
        }

        return cb(false, `In ${location}, is now ${res.body.result}`);
    });
};
