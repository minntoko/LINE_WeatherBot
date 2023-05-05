const cron = require("cron");
const { users, reverseConvert } = require("./setting.js");
const { getWeather, getWeatherFlex } = require("./weather.js");
const { client } = require("./config.js");

let jobs = [];
const periodic = () => {
  users.forEach((user) => {
    if (user.enabled) {
      jobs.forEach((job) => {
        job.stop();
      });
      jobs = [];
      const cronExpressions = user.cronExpression;
      cronExpressions.forEach((cronExpression) => {
        const job = new cron.CronJob(
          cronExpression,
          async () => {
            const message = await getWeather(user.region || "Nagoya");
            const flexMessage = await getWeatherFlex(user.region || "Nagoya");
            try {
              await sendWeatherMessage(
                user.userId,
                message,
                flexMessage,
                user.region || "Nagoya"
              );
              console.log(
                `ユーザーID ${user.userId} にメッセージを送信しました。`
              );
            } catch (err) {
              console.error(err);
            }
          },
          null,
          false,
          "Asia/Tokyo"
        );
        jobs.push(job);
      });
      jobs.forEach((job) => {
        job.start();
      });
    }
  });

  async function sendWeatherMessage(
    userId,
    message,
    flexMessage,
    region
  ) {
    await client.pushMessage(userId, [
      {
        type: "text",
        text: `${reverseConvert(region)}の天気をお伝えします。`,
      },
      {
        type: "flex",
        altText: message,
        contents: flexMessage,
      },
    ]);
  }
};

module.exports = { periodic: periodic };
