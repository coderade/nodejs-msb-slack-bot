require('should');
const config = require('../../config');
const SlackClient = require('../../server/slack-client');

describe('slackClient', function () {
    it('should succesfully connect to Slack', (done) => {

        const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, null, null, config.log('test'));
        slackClient.start((slackRes) => {
            slackRes.ok.should.be.true;
            return done();
        });
    });
});