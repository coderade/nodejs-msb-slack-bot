const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let rtm = null;
let nlp = null;

let handleOnAuthenticated = (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not connected to a channel yet`);
};

let addAuthenticatedHandler = (rtm, handler) => {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
};

let handleOnMessage = (message) => {

    if (message.text.toLowerCase().includes('siri')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
            }

            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error('Could not extract the intent');
                }

                const intent = require(`./intents/${res.intent[0].value}Intent`);

                intent.process(res, function (error, response) {
                    if (error) {
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                });

            } catch (err) {
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, I dont't know what you are talking about.", message.channel);
            }

        });

    }
};

module.exports.init = function slackClient(bot_token, logLevel, nlpClient) {
    rtm = new RtmClient(bot_token, {logLevel: logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
};


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;