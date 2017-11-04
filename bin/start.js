'use strict';

const slackClient = require('../server/slack-client');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

const slackToken = process.env.BOT_API_TOKEN;
const slackLogLevel = process.env.SLACK_LOG_LEVEL || 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function () {
    console.log(`SIRI is listening in ${server.address().port} in ${service.get('env')} mode.`);
});