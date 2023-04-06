const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
dotenv.config();

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY,
};

const client = new line.Client(config);

module.exports = {
  line: line,
  config: config,
  client: client
};