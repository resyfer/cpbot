# Resyfer's Discord CPBot

![img](https://img.shields.io/badge/bot%20status-offline-red)&emsp;![img](https://img.shields.io/badge/-NodeJS-green)&emsp;![img](https://img.shields.io/badge/Version-1.0-yellow)

This is NodeJS bot for a competitive programming Discord server, something like a coding club.

Get the bot [here](https://discord.com/api/oauth2/authorize?client_id=849932013188415488&permissions=8&scope=bot)
## Development

- Setup
```
$ git clone https://github.com/resyfer/cp-ranking.git
$ cd cp-ranking
$ npm install
$ echo "{}" > data.json
```

- Environment Variables
```
$ echo "DISCORD_BOT_TOKEN=" > .env
```
  - Open the `.env` file and set it as:
```
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
```

- Make Bot go live
```
$ npm start
```