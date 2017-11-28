const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');

const serviceRegistry = new ServiceRegistry();

service.put('/service/:intent/:port', (req, res, next) => {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;

    //check if it's in IPv6 notation with a double colon and put the IP address in curly brackets. In any other case, simply return the
    //remote address
    const serviceIp = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;


    serviceRegistry.add(serviceIntent, serviceIp, servicePort);

    res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
});

module.exports = service;