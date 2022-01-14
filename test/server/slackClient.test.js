const SlackClient = require('../../server/slack-client');
const { RtmClient } = require('@slack/client');

jest.mock('@slack/client');

describe('SlackClient', () => {
    let slackClient;
    let rtmMock;
    let logMock;
    let nlpMock;
    let registryMock;

    beforeEach(() => {
        rtmMock = {
            start: jest.fn(),
            on: jest.fn(),
            sendMessage: jest.fn()
        };
        RtmClient.mockImplementation(() => rtmMock);
        logMock = { info: jest.fn(), error: jest.fn() };
        nlpMock = { ask: jest.fn() };
        registryMock = { get: jest.fn() };

        slackClient = new SlackClient('test-token', 'debug', nlpMock, registryMock, logMock);
    });

    test('should start RTM client', () => {
        slackClient.start(() => { });
        expect(rtmMock.start).toHaveBeenCalled();
    });

    test('should handle messages', async () => {
        const message = { text: 'codebot', channel: 'test-channel' };
        nlpMock.ask.mockResolvedValue({ intent: [{ value: 'test-intent' }] });

        const intentMock = { process: jest.fn((res, registry, log, cb) => cb(null, 'response')) };
        jest.mock('../../server/intents/test-intentIntent', () => intentMock, { virtual: true });

        await slackClient._handleOnMessage(message);

        expect(rtmMock.sendMessage).toHaveBeenCalledWith('response', 'test-channel');
    });
});