require('should');
const ServiceRegistry = require('../../server/serviceRegistry');

describe('ServiceRegistry', () => {
    describe('new', () => {
        it('should accept a timeout being passed in', (done) => {
            const serviceRegistry = new ServiceRegistry(41);
            serviceRegistry._timeout.should.equal(41);
            done();
        });

    });

    describe('add / get', () => {
        it('should add a new intent to the registry and provide it via get', () => {
            const serviceRegistry = new ServiceRegistry(30);
            serviceRegistry.add('test', '127.0.0.1', 1994);
            const testIntent = serviceRegistry.get('test');
            testIntent.intent.should.equal('test');
            testIntent.ip.should.equal('127.0.0.1');
            testIntent.port.should.equal(1994);
        });


        it('should update a service', () => {
            const serviceRegistry = new ServiceRegistry(30);
            serviceRegistry.add('test', '127.0.0.1', 1994);
            const testIntent1 = serviceRegistry.get('test');
            serviceRegistry.add('test', '127.0.0.1', 1994);
            const testIntent2 = serviceRegistry.get('test');

            Object.keys(serviceRegistry._services).length.should.equal(1);

            testIntent2.timestamp.should.be.greaterThanOrEqual(testIntent1.timestamp);
        });
    });

    describe('remove', () => {
        it('should remove a service from registry', () => {
            const serviceRegistry = new ServiceRegistry(30);
            serviceRegistry.add('test', '127.0.0.1', 1994);
            serviceRegistry.remove('test', '127.0.0.1', 1994);
            const testIntent = serviceRegistry.get('test');
            should.not.exist(testIntent);
        });
    });

    describe('cleanup', () => {
        it('should remove expired services from registry', () => {
            const serviceRegistry = new ServiceRegistry(-1);
            serviceRegistry.add('test', '127.0.0.1', 1994);
            const testIntent = serviceRegistry.get('test');
            should.not.exist(testIntent);
        });
    });
});