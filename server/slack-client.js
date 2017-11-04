const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

let handleOnAuthenticated = (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not connected to a channel yet`);
};

let addAuthenticatedHandler = (rtm, handler) => {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
};


module.exports.init = function slackClient(bot_token, logLevel) {
    const rtm = new RtmClient(bot_token, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    return rtm;
};


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;