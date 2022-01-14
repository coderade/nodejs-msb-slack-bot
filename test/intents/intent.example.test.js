const intentExample = require('../../server/intents/intent.example');

describe('intentExample', () => {
    let registryMock;
    let logMock;

    beforeEach(() => {
        registryMock = {
            get: jest.fn()
        };
        logMock = { error: jest.fn() };
    });

    test('should process intent successfully', (done) => {
        registryMock.get.mockReturnValue({ ip: '127.0.0.1', port: '3000' });

        const intentData = {
            intent: [{ value: 'intent-name' }],
            location: [{ value: 'test-location' }]
        };

        intentExample.process(intentData, registryMock, logMock, (error, response) => {
            expect(error).toBeFalsy();
            expect(response).toBe('In test-location, is now undefined'); // adjust this based on actual response handling
            done();
        });
    });

    test('should return error for incorrect intent', (done) => {
        const intentData = {
            intent: [{ value: 'wrong-intent' }],
            location: [{ value: 'test-location' }]
        };

        intentExample.process(intentData, registryMock, logMock, (error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe('Expected intent-name intent, got wrong-intent');
            done();
        });
    });

    test('should return error for missing service', (done) => {
        registryMock.get.mockReturnValue(null);

        const intentData = {
            intent: [{ value: 'intent-name' }],
            location: [{ value: 'test-location' }]
        };

        intentExample.process(intentData, registryMock, logMock, (error, response) => {
            expect(error).toBeFalsy();
            expect(response).toBe('No service available');
            done();
        });
    });
});
