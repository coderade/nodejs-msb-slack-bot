const config = require('../../config');

describe('Config', () => {
    test('should load configuration values', () => {
        process.env.WIT_TOKEN = 'test-wit-token';
        process.env.SLACK_BOT_TOKEN = 'test-slack-bot-token';
        process.env.SLACK_LOG_LEVEL = 'debug';
        process.env.BOT_API_TOKEN = 'test-bot-api-token';
        process.env.SERVICE_TIMEOUT = '30';

        expect(config.witToken).toBe('test-wit-token');
        expect(config.slackToken).toBe('test-slack-bot-token');
        expect(config.slackLogLevel).toBe('debug');
        expect(config.botApiToken).toBe('test-bot-api-token');
        expect(config.serviceTimeout).toBe(30);
    });

    test('should use default service timeout if not set', () => {
        delete process.env.SERVICE_TIMEOUT;

        expect(config.serviceTimeout).toBe(30);
    });

    test('should throw error for missing required environment variables', () => {
        delete process.env.WIT_TOKEN;
        delete process.env.SLACK_BOT_TOKEN;
        delete process.env.BOT_API_TOKEN;

        expect(() => config).toThrow('Missing required environment variable: WIT_TOKEN');
    });
});
