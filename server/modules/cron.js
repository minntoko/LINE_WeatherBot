const cron = require("cron");
const { users } = require("./setting.js");
const { getWeather } = require("./weather.js");
const { client } = require("./config.js");

const periodic = () => {
  users.forEach((user) => {
    const cronExpressions = user.cronExpression;
    cronExpressions.forEach((cronExpression) => {
      const job = new cron.CronJob(
        cronExpression,
        async () => {
          const message = await getWeather(user.region);
          client
            .pushMessage(user.userId, message)
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
  });
};

module.exports = {periodic:periodic};
