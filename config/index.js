require('dotenv').config();
const bunyan = require('bunyan');

const log = {
    development: () => {
        return bunyan.createLogger({name: 'CODEBOT-dev', level: 'debug'});
    },
    production: () => {
        return bunyan.createLogger({name: 'CODEBOT-prod', level: 'info'});
    },
    test: () => {
        return bunyan.createLogger({name: 'CODEBOT-test', level: 'fatal'});
    }
};

module.exports = {
    witToken: process.env.WIT_TOKEN,
    slackToken: process.env.BOT_API_TOKEN,
    slackLogLevel: process.env.SLACK_LOG_LEVEL,
    serviceTimeout: 30,
    log: (env) => {
        if (env) return log[env]();
        return log[process.env.NODE_ENV || 'development']();
    }
};