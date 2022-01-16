const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');

class SlackClient {
    constructor(slackToken, logLevel, nlp, registry, log) {
        this._rtm = new RtmClient(slackToken, { logLevel });
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

    async _handleOnMessage(message) {
        if (message.text.toLowerCase().includes('codebot')) {
            try {
                const res = await this._nlp.ask(message.text);

                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error('Could not extract the intent');
                }

                const intent = require(`./intents/${res.intent[0].value}Intent`);

                intent.process(res, this._registry, this._log, (error, response) => {
                    if (error) {
                        this._log.error(error.message);
                        return;
                    }

                    this._rtm.sendMessage(response, message.channel);
                });

            } catch (err) {
                this._log.error(err);
                this._rtm.sendMessage('Sorry, I don\'t know what you are talking about.', message.channel);
            }
        }
    }

    start(handler) {
        this._addAuthenticatedHandler(handler);
        this._rtm.start();
    }
}

module.exports = SlackClient;