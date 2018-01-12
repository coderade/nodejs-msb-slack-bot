const config = require('../config');

const slackClient = require('../server/slack-client');
const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);

const WitClient = require('../server/wit-client');
const witClient = new WitClient(config.witToken);

const slackLogLevel = config.slackLogLevel|| 'verbose';

const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(config.slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function () {
    console.log(`CODEBOT is listening in ${server.address().port} in ${service.get('env')} mode.`);
});