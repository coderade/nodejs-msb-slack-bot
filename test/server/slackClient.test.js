require('should');
const config = require('../../config');
const slackClient = require('../../server/slack-client');

describe('slackClient', function () {
    it('should succesfully connect to Slack', (done) => {
        const rtm = slackClient.init(config.slackToken, config.slackLogLevel);
        rtm.start();
        slackClient.addAuthenticatedHandler(rtm, (slackRes) => {
            //Thie slackRes should contain a property ok and this property should be true when everything went well.
            slackRes.ok.should.be.true;
            return done();
        });

    });
});