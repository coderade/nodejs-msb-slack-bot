require('dotenv').config();

module.exports = {
    witToken: process.env.WIT_TOKEN,
    slackToken: process.env.BOT_API_TOKEN,
    slackLogLevel: process.env.SLACK_LOG_LEVEL
};