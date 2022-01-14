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
    server.listen(config.port || 3000, () => {
        log.info(`CODEBOT is listening on port ${server.address().port} in ${service.get('env')} mode.`);
    });
});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
