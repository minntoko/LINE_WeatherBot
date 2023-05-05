const cron = require("cron");
const { users, reverseConvert } = require("./setting.js");
const { getWeather, getWeatherFlex } = require("./weather.js");
const { client } = require("./config.js");

const periodic = () => {
  users.forEach((user) => {
    if (user.enabled) {
      const cronExpressions = user.cronExpression;
      cronExpressions.forEach((cronExpression) => {
        const job = new cron.CronJob(
          cronExpression,
          async () => {
            const message = await getWeather(user.region || "Nagoya");
            const flexMessage = await getWeatherFlex(user.region || "Nagoya");
            client
              .pushMessage(user.userId, [
                {
                  type: "text",
                  text: `${reverseConvert(user.region || "Nagoya")}の天気をお伝えします。`,
                },
                {
                  type: "flex",
                  altText: message,
                  contents: flexMessage,
                },
              ])
              .then(() => {
                console.log(
                  `ユーザーID ${user.userId} にメッセージを送信しました。`
                );
              })
              .catch((err) => {
                console.error(err);
              });
          },
          null,
          false,
          "Asia/Tokyo"
        );
        job.start();
      });
    }
    return null;
  });
};

module.exports = { periodic: periodic };
