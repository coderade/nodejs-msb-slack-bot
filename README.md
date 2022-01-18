# Node.js Microservice-based Slack Bot

Slack Bot application developed in Node.js.

![SlackBot](doc/images/slackbot.png)

The project is set up with an express application, a bot using [Slack](https://slack.com/), and uses the [Wit.ai](https://wit.ai/) service for natural language processing.

## Status

[![Codeship Status for coderade/nodejs-msb-slack-bot](https://app.codeship.com/projects/a16ebc70-0220-0136-a7cd-1e9c793cff7d/status?branch=master)](https://app.codeship.com/projects/280037) ![Not Maintained](https://img.shields.io/badge/Maintenance%20Level-Not%20Maintained-yellow.svg)

**This project was developed in 2016 to create a Slack bot application using Node.js and ES6. It is not maintained anymore. Some libraries are updated using [Dependabot](https://dependabot.com/) and [Snyk.io](https://snyk.io/) services, but no further tests are being done.**

## Prerequisites

- Node.js (Recommended to use [NVM](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/en/) package manager
- Slack account and a Slack workspace
- Wit.ai account

## Setting Up Slack and Wit.ai

### Creating the Slack Bot User

To use a bot on Slack for this project, create a bot user by following the Slack official [documentation](https://api.slack.com/bot-users).

### Creating the Wit.ai App

1. Log in to [Wit.ai](https://wit.ai/) with your GitHub account.
2. Create an app by importing the data from the [codebot-witai-settings](https://github.com/coderade/codebot-witai-settings) project as a zip file. This project contains all the necessary intents to run this project.

![Wit.ai Intents](doc/images/wit-ai-intents.png)

## Project Intents

This project includes two intents: the [Time](server/intents/timeIntent.js) and [Weather](server/intents/weatherIntent.js) intents. You can create new intents by following the [intent.example.js](server/intents/intent.example.js) file.

There are two services serving the intents for this project:

- [Time Microservice](https://github.com/coderade/nodejs-time-microservice): Returns the local time for a given location.
- [Weather Microservice](https://github.com/coderade/nodejs-weather-microservice): Returns the weather for a given location.

These services announce themselves to the main application, which keeps track of the available services and routes the requests using a Service registry.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/nodejs-msb-slack-bot.git
    cd nodejs-msb-slack-bot
    ```

2. Install the dependencies:
    ```bash
    yarn install
    ```

3. Copy the example environment file and update it with your credentials:
    ```bash
    cp .env-example .env
    ```

    Update the `.env` file with your Slack Bot Token, Wit.ai Token, and Bot API Token.

    ```plaintext
    SLACK_BOT_TOKEN=your-slack-bot-token
    WIT_TOKEN=your-wit-token
    SLACK_LOG_LEVEL=verbose
    BOT_API_TOKEN=your-bot-api-token
    ```

## Running the Bot Application

To run the application, ensure your environment variables are set, then start the application:

```bash
node bin/start.js
```

If everything is set up correctly, you should see output indicating the bot is connected and listening:

```plaintext
verbose: Attempting to connect via the RTM API
verbose: Retrying url=https://slack.com/api/rtm.start
verbose: rtm.start successful, attempting to open websocket URL
Logged in as coderade-bot of team Slackbot Nodejs, but not connected to a channel yet
CODEBOT is listening on port 3000 in development mode.
```

## Testing

This project uses [Mocha](https://mochajs.org/), [Should](https://shouldjs.github.io/), and [Istanbul](https://istanbul.js.org/) for testing.

To run all tests, lint the code, and check coverage:

```bash
npm test
```

Or run the following command directly:

```bash
NODE_ENV=test eslint server bin && nyc mocha --recursive test --exit
```

## Deployment with PM2

1. Install PM2 globally:
    ```bash
    npm install pm2 -g
    ```

2. Copy the example PM2 ecosystem configuration file:
    ```bash
    cp ecosystem.config.example.js ecosystem.config.js
    ```

3. Set up your deployment configuration in `ecosystem.config.js` with your server details.

4. Deploy the application using PM2:
    ```bash
    pm2 deploy production setup
    pm2 deploy production
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.