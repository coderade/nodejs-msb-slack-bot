const request = require('supertest');
const express = require('express');
const service = require('../../server/service');
const ServiceRegistry = require('../../server/serviceRegistry');
const config = require('../../config');

jest.mock('../../config', () => ({
    botApiToken: 'test-bot-api-token',
    serviceTimeout: 30,
    log: () => ({ info: jest.fn(), error: jest.fn() })
}));

describe('Service', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use('/service', service(config));
    });

    test('should register a service', async () => {
        const response = await request(app)
            .put('/service/test-intent/3000')
            .set('X-BOT-API-TOKEN', 'test-bot-api-token')
            .set('X-BOT-SERVICE-TOKEN', 'test-service-token');

        expect(response.status).toBe(200);
        expect(response.body.result).toBe('test-intent at ::ffff:127.0.0.1:3000');
    });

    test('should return 403 for invalid API token', async () => {
        const response = await request(app)
            .put('/service/test-intent/3000')
            .set('X-BOT-API-TOKEN', 'invalid-api-token')
            .set('X-BOT-SERVICE-TOKEN', 'test-service-token');

        expect(response.status).toBe(403);
    });

    test('should return 400 for missing service token', async () => {
        const response = await request(app)
            .put('/service/test-intent/3000')
            .set('X-BOT-API-TOKEN', 'test-bot-api-token');

        expect(response.status).toBe(400);
    });
});