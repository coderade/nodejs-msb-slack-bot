const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

class slackClient {
    constructor(slackToken, logLevel, nlp, registry, log) {
        this._rtm = new RtmClient(slackToken, {logLevel: logLevel});
        this._nlp = nlp;
        this._registry = registry;
        this._log = log;

        this._addAuthenticatedHandler(this._handleOnAuthenticated);

        this._rtm.on(RTM_EVENTS.MESSAGE, this._handleOnMessage.bind(this));
    }

    _handleOnAuthenticated(rtmStartData) {
        this._log.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not connected to a channel yet`);
    }

    _addAuthenticatedHandler(handler) {
        this._rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler.bind(this));
    }

    _handleOnMessage(message) {
        if (message.text.toLowerCase().includes('codebot')) {
            this._nlp.ask(message.text, (err, res) => {
                if (err) {
                    this._log.error(err);
                }

                try {
                    if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                        throw new Error('Could not extract the intent');
                    }

                    const intent = require(`./intents/${res.intent[0].value}Intent`);

                    intent.process(res, this._registry, this._log, (error, response) => {
                        if (error) {
                            this._log.error(error.message);
                            return;
                        }

                        return this._rtm.sendMessage(response, message.channel);
                    });

                } catch (err) {
                    this._log.error(err);
                    this._log.error(res);
                    this._rtm.sendMessage(`Sorry, I dont't know what you are talking about.`, message.channel);
                }

            });
        }

    }

    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._rtm.start();
    }
}

module.exports = slackClient;