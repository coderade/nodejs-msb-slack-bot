const WitClient = require('../../server/wit-client');
const request = require('superagent');

jest.mock('superagent');

describe('WitClient', () => {
    let witClient;

    beforeEach(() => {
        witClient = new WitClient('test-token');
    });

    test('should send a request to Wit.ai', async () => {
        const resMock = { statusCode: 200, body: { entities: 'test-entities' } };
        request.get.mockImplementation(() => ({
            set: jest.fn().mockReturnThis(),
            query: jest.fn().mockReturnThis(),
            end: jest.fn((callback) => callback(null, resMock))
        }));

        const response = await witClient.ask('test-message');

        expect(response).toBe('test-entities');
    });

    test('should handle errors from Wit.ai', async () => {
        request.get.mockImplementation(() => ({
            set: jest.fn().mockReturnThis(),
            query: jest.fn().mockReturnThis(),
            end: jest.fn((callback) => callback(new Error('test error')))
        }));

        await expect(witClient.ask('test-message')).rejects.toThrow('Wit.ai request failed: test error');
    });
});