require('dotenv').config();
const bunyan = require('bunyan');

// Logger configuration based on the environment
const loggers = {
    development: () => bunyan.createLogger({ name: 'CODEBOT-dev', level: 'debug' }),
    production: () => bunyan.createLogger({ name: 'CODEBOT-prod', level: 'info' }),
    test: () => bunyan.createLogger({ name: 'CODEBOT-test', level: 'fatal' }),
};

// Retrieve the logger based on the provided environment
const getLogger = (env) => {
    const environment = env || process.env.NODE_ENV || 'development';
    return loggers[environment] ? loggers[environment]() : loggers.development();
};

const config = {
    witToken: process.env.WIT_TOKEN,
    slackToken: process.env.SLACK_BOT_TOKEN,
    slackLogLevel: process.env.SLACK_LOG_LEVEL,
    botApiToken: process.env.BOT_API_TOKEN,
    serviceTimeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 30,
    log: getLogger(process.env.NODE_ENV),
};

// Validate required environment variables
const requiredEnvVars = ['WIT_TOKEN', 'SLACK_BOT_TOKEN', 'BOT_API_TOKEN'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

module.exports = config;
