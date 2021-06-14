# Resyfer's Discord CPBot

![img](https://img.shields.io/badge/bot%20status-offline-red) ![img](https://img.shields.io/badge/NodeJS-16.3.0-brightgreen) ![img](https://img.shields.io/badge/Version-Alpha%201.0-yellow)

This is NodeJS bot for a competitive programming Discord server, something like a coding club.

Dependencies:
NPM Packages : ![img](https://img.shields.io/badge/axios-0.21.1-blue) ![img](https://img.shields.io/badge/discord.js-12.5.3-blue) ![img](https://img.shields.io/badge/dotenv-10.0.0-blue) ![img](https://img.shields.io/badge/nodemon-2.0.7-blue)

Get the bot [here](https://discord.com/api/oauth2/authorize?client_id=849932013188415488&permissions=8&scope=bot)
## Development

- Setup
```
git clone https://github.com/resyfer/cpbot.git
cd cpbot
npm install
echo "{}" > data.json
```

- Environment Variables
```
echo "DISCORD_BOT_TOKEN=" > .env
```
  - Get your [discord bot token](https://discord.com/developers/docs/intro)
  - Open the `.env` file and set it as:
```
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
```

- Make Bot go live
```
npm start
```
