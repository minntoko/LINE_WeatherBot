const users = [];

// 地域変換テーブル
const cityNames = {
  札幌: "Sapporo",
  仙台: "Sendai",
  東京: "Tokyo",
  名古屋: "Nagoya",
  大阪: "Osaka",
  福岡: "Fukuoka",
  那覇: "Naha",
};

// 逆引き用
const reversedCityNames = {};
for (const key in cityNames) {
  const value = cityNames[key];
  reversedCityNames[value] = key;
}

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

// 地域を英語に変換
const convertCityName = (cityName) => {
  const matchedKey = Object.keys(cityNames).find((key) => {
    const regex = new RegExp(key);
    return regex.test(cityName);
  });

  const converted = cityNames[matchedKey];
  return converted ? converted : null;
};

// 地域を日本語に変換
const reverseConvert = (cityName) => {
  return reversedCityNames[cityName];
};

// ユーザ情報を更新
const updateUser = (newUser) => {
  const targetUser = users.find((user) => {
    return user.userId == newUser.userId;
  });
  const updatedUser = { ...targetUser, ...newUser };
  Object.assign(targetUser, updatedUser);

  return updatedUser;
};

// ユーザを追加する処理
const addUser = (userId) => {
  users.push({
    userId: userId,
    region: null,
    cronExpression: [],
    enabled: true,
  });
};

// メッセージからクーロン式に変換する処理
// 例：「平日の9時に通知して」→「0 0 9 * * Mon-Fri」
// 例：「土日の10時に通知して」→「0 0 10 * * Sat-Sun」
// 例：「毎週水曜日の23時59分に通知して」→「0 59 23 * * Wed」
function createCronExpression(message) {
  const parts = message
    .replace(/曜日/g, "")
    .replace(/毎週/g, "")
    .replace(/分/g, "")
    .replace(/と/g, ",")
    .replace(/に通知して.*/g, "")
    .replace(/の通知を.*/g, "")
    .split("の");

  let minute = parts[1].split(/(?:時|:|：)/)[1] || 0;
  let hour = parts[1].split(/(?:時|:|：)/)[0];

  if (parts[0] === "平日") {
    return `0 ${minute} ${hour} * * 1,2,3,4,5`;
  } else if (parts[0] === "土日" || parts[0] === "休日") {
    return `0 ${minute} ${hour} * * 0,6`;
  } else if (weekdays.includes(parts[0])) {
    const dayOfWeek = weekdays.indexOf(parts[0]);
    return `0 ${minute} ${hour} * * ${dayOfWeek}`;
  }
  throw new Error("Invalid expression");
}

const updateCron = ({ expression, userId }) => {
  users.forEach((user) => {
    if (user.userId === userId) {
      user.cronExpression.push(expression);
    }
  });
  console.log("ユーザー情報を更新しました。");
};

// すでに登録されているクーロン式かどうかを判定する処理
const isExistingCron = ({ expression, userId }) => {
  const user = users.find((user) => user.userId === userId);

  const parts = expression.split(" ");
  // ユーザーのcron式を繰り返し、チェック対象の式と部分的に一致する部分があるかどうかをチェックする。
  let flag = false;
  result = false;
  user.cronExpression.forEach((cron) => {
    flag = false;
    const cronParts = cron.split(" ");
    // 分が一致するかどうか
    if (parts[1] === cronParts[1]) {
      flag = true;
    }
    // 時が一致するかどうか
    parts[2] === cronParts[2] && flag ? (flag = true) : (flag = false);
    // 日が一致するかどうか
    parts[3] === cronParts[3] && flag ? (flag = true) : (flag = false);
    // 月が一致するかどうか
    parts[4] === cronParts[4] && flag ? (flag = true) : (flag = false);
    // 曜日が一致するかどうか
    if (parts[5] === cronParts[5] && flag) {
      result = true;
    }
    if (flag) {
      // 平日→金曜日=登録済み, 金曜日→平日=上書き
      if (cronParts[5].split(",").includes(parts[5])) {
        // 5 > 1,2,3,4,5 -> false
        // 一部重複している
        console.log("重複してる通知があります。");
        result = true;
      } else if (!cronParts[5].split(",").length === 1) {
        console.log("通知を上書きします。");
        user.cronExpression = user.cronExpression.filter(
          (existingCron) => existingCron !== cron
        );
      } else {
        // 重複していない
        console.log("通知を追加します。");
      }
    }
  });
  // 登録済みだった場合はtrueを返す。
  return result;
};

// クーロン式を削除する処理
const deleteCron = ({ expression, userId }) => {
  users.forEach((user) => {
    if (user.userId === userId) {
      // 一致しないものだけを残す
      user.cronExpression = user.cronExpression.filter(
        (cron) => cron !== expression
      );
    }
  });
};

// クーロン式からメッセージに変換する処理
// 例： 「0 9 * * 1-5」 -> 「平日の9時」
// 例： 「0 10 * * 0,6」 -> 「土日の10時」
// 例： 「0 10,23 * * 0,6」 -> 「土日の10時と23時」
// 例： 「59 23 * * 3」 -> 「水曜日の23時59分」
const convertCronToMessage = (cronExpression) => {
  try {
    const parts = cronExpression.split(" ");
    const minute = parts[1];
    const hour = parts[2];
    const dayOfMonth = parts[3];
    const month = parts[4];
    const dayOfWeek = parts[5];

    let message = "毎週";
    if (dayOfWeek === "1,2,3,4,5") {
      message += "平日";
    } else if (dayOfWeek === "0,6") {
      message += "土日";
    } else {
      message += dayOfWeek
        .split(",")
        .map((value) => weekdays[value] + "曜日")
        .join("と");
    }
    message += `の${hour}時`;
    message += minute === "0" ? "" : minute + "分";
    return message;
  } catch (err) {
    console.error("Error parsing cron expression", err);
    return null;
  }
};

module.exports = {
  users: users,
  updateUser: updateUser,
  convertCityName: convertCityName,
  reverseConvert: reverseConvert,
  updateCron: updateCron,
  convertCronToMessage: convertCronToMessage,
  createCronExpression: createCronExpression,
  deleteCron: deleteCron,
  isExistingCron: isExistingCron,
  addUser: addUser,
};
