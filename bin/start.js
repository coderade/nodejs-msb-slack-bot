const slackClient = require('../server/slack-client');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = process.env.WIT_TOKEN;
const witClient = require('../server/wit-client')(witToken);

const slackToken = process.env.BOT_API_TOKEN;
const slackLogLevel = process.env.SLACK_LOG_LEVEL || 'verbose';

const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function () {
    console.log(`CODEBOT is listening in ${server.address().port} in ${service.get('env')} mode.`);
});