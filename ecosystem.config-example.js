module.exports = {
    apps: [
        {
            name: 'nodejs-msb-slack-bot',
            script: 'bin/start.js',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            user: 'node',
            host: '<YOUR SERVER IP>',
            ref: 'origin/master',
            key: 'path/to/some.pem',
            repo: 'https://github.com/<YOUR_REPO_URL>',
            path: '/srv/production',
            'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production',
        },
    },
};
