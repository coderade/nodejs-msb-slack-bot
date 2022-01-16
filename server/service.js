const express = require('express');
const ServiceRegistry = require('./serviceRegistry');

module.exports = (config) => {
    const service = express();
    const serviceRegistry = new ServiceRegistry(config.serviceTimeout, config.log());
    service.set('serviceRegistry', serviceRegistry);

    service.use(express.json());

    service.put('/service/:intent/:port', (req, res) => {
        const serviceToken = req.get('X-BOT-SERVICE-TOKEN');
        if (req.get('X-BOT-API-TOKEN') !== config.botApiToken) {
            return res.sendStatus(403);
        }

        if (!serviceToken) {
            return res.sendStatus(400);
        }

        const { intent: serviceIntent, port: servicePort } = req.params;

        const serviceIp = req.connection.remoteAddress.includes('::')
            ? `[${req.connection.remoteAddress}]`
            : req.connection.remoteAddress;

        serviceRegistry.add(serviceIntent, serviceIp, servicePort, serviceToken);

        res.json({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` });
    });

    return service;
};
