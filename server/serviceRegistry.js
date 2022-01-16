class ServiceRegistry {
    constructor(timeout, log) {
        this._services = {};
        this._timeout = timeout;
        this._log = log;
    }

    add(intent, ip, port, accessToken) {
        const key = `${intent}-${ip}-${port}-${accessToken}`;

        if (!this._services[key]) {
            this._services[key] = {
                timestamp: Math.floor(Date.now() / 1000),
                ip,
                port,
                intent,
                accessToken
            };

            this._log.info(`Added service for ${intent} on ${ip}:${port}`);
        } else {
            this._services[key].timestamp = Math.floor(Date.now() / 1000);
            this._log.info(`Updated service for ${intent} on ${ip}:${port}`);
        }

        this._cleanup();
    }

    remove(intent, ip, port, accessToken) {
        const key = `${intent}-${ip}-${port}-${accessToken}`;
        delete this._services[key];
    }

    get(intent) {
        this._cleanup();
        return Object.values(this._services).find(service => service.intent === intent) || null;
    }

    _cleanup() {
        const now = Math.floor(Date.now() / 1000);

        Object.keys(this._services).forEach(key => {
            if (this._services[key].timestamp + this._timeout < now) {
                this._log.info(`Removed service for intent ${this._services[key].intent} on ${this._services[key].ip}:${this._services[key].port}`);
                delete this._services[key];
            }
        });
    }
}

module.exports = ServiceRegistry;