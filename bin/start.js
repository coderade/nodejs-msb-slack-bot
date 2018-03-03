const config = require('../config');
const log = config.log();

const SlackClient = require('../server/slack-client');
const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);

const WitClient = require('../server/wit-client');
const witClient = new WitClient(config.witToken);

const serviceRegistry = service.get('serviceRegistry');
const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, witClient, serviceRegistry, log);

slackClient.start(() => {
    server.listen(3000);
});

server.on('listening', function () {
    log.info(`CODEBOT is listening in ${server.address().port} in ${service.get('env')} mode.`);
});




