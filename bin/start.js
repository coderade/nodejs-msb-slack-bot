const config = require('../config');

const SlackClient = require('../server/slack-client');
const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);

const WitClient = require('../server/wit-client');
const witClient = new WitClient(config.witToken);

const serviceRegistry = service.get('serviceRegistry');
const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, witClient, serviceRegistry);;

slackClient.start(() =>{
    server.listen(3000);
});

slackClient._addAuthenticatedHandler(slackClient, () => server.listen(3000));

server.on('listening', function () {
    console.log(`CODEBOT is listening in ${server.address().port} in ${service.get('env')} mode.`);
});