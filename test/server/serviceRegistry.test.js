const ServiceRegistry = require('../../server/serviceRegistry');

describe('ServiceRegistry', () => {
    let serviceRegistry;
    let logMock;

    beforeEach(() => {
        logMock = { info: jest.fn(), error: jest.fn() };
        serviceRegistry = new ServiceRegistry(30, logMock);
    });

    test('should add a service', () => {
        serviceRegistry.add('test-intent', '127.0.0.1', '3000', 'test-token');
        const service = serviceRegistry.get('test-intent');
        expect(service).toEqual(expect.objectContaining({
            intent: 'test-intent',
            ip: '127.0.0.1',
            port: '3000',
            accessToken: 'test-token'
        }));
    });

    test('should remove a service', () => {
        serviceRegistry.add('test-intent', '127.0.0.1', '3000', 'test-token');
        serviceRegistry.remove('test-intent', '127.0.0.1', '3000', 'test-token');
        const service = serviceRegistry.get('test-intent');
        expect(service).toBeNull();
    });

    test('should clean up expired services', () => {
        serviceRegistry.add('test-intent', '127.0.0.1', '3000', 'test-token');
        jest.advanceTimersByTime(31000); // advance time by 31 seconds
        serviceRegistry._cleanup();
        const service = serviceRegistry.get('test-intent');
        expect(service).toBeNull();
    });
});