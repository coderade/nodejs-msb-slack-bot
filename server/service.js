const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');

module.exports = (config) => {

    const serviceRegistry = new ServiceRegistry(config.serviceTimeout, config.log());
    service.set('serviceRegistry', serviceRegistry);

    service.put('/service/:intent/:port', (req, res, next) => {


        let serviceToken = req.get('X-BOT-SERVICE-TOKEN');
        if (req.get('X-BOT-API-TOKEN') !== config.botApiToken) {
            return res.sendStatus(403);
        }

        if (!serviceToken ) {
            return res.sendStatus(400);
        }

        const serviceIntent = req.params.intent;
        const servicePort = req.params.port;

        //check if it's in IPv6 notation with a double colon and put the IP address in curly brackets. In any other case, simply return the
        //remote address
        const serviceIp = req.connection.remoteAddress.includes('::')
            ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;


        serviceRegistry.add(serviceIntent, serviceIp, servicePort, serviceToken);

        res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
    });

    return service;

};
