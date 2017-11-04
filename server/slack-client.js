const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let rtm = null;

let handleOnAuthenticated = (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not connected to a channel yet`);
};

let addAuthenticatedHandler = (rtm, handler) => {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
};

let handleOnMessage = (message) => {
    console.log(message);
    rtm.sendMessage(`Hello!! this is a reply for your => "${message.text}" message!`
        , message.channel);

};

module.exports.init = function slackClient(bot_token, logLevel) {
    rtm = new RtmClient(bot_token, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
};


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;