const users = [
  {
    userId: process.env.USER_ID1,
    cronExpression: [],
    region: "Nagoya",
    enabled: true,
  },
  {
    userId: process.env.USER_ID1,
    cronExpression: [],
    region: "Tokyo",
    enabled: true,
  },
];

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
  const isExistingUser = users.some((user) => user.userId === userId);
  if (!isExistingUser) {
    const newUser = {
      userId: userId,
      cronExpression: [],
      region: null,
      enabled: true,
    };
    users.push(newUser);
    console.log(`User ${userId} has been added.`);
  } else {
    console.log(`User ${userId} already exists.`);
  }
};

// メッセージからクーロン式に変換する処理
// 例：「平日の9時に通知して」→「0 0 9 * * Mon-Fri」
// 例：「月から金の9時に通知して」→「0 0 9 * * Mon-Fri」
// 例：「土日の10時に通知して」→「0 0 10 * * Sat-Sun」
// 例：「土日の10時と23時に通知して」→「0 0 10,23 * * Sat-Sun」
// 例：「毎週水曜日の23時59分に通知して」→「0 59 23 * * Wed」
// 課題　→　ありえない時間を指定した場合の処理
function createCronExpression(expression) {
  const parts = expression
    .replace(/曜日/g, "")
    .replace(/毎週/g, "")
    .replace(/分/g, "")
    .replace(/と/g, ",")
    .replace(/に通知して.*/g, "")
    .split("の");

  let minute = parts[1].split(/(?:時|:|：)/)[1] || 0;
  let hour = parts[1].split(/(?:時|:|：)/)[0];

  if (isNaN(hour) || isNaN(minute)) {
    throw new Error("Invalid time format");
  }

  console.log(parts);

  if (parts[0] === "平日") {
    return `0 ${minute} ${hour} * * 1-5`;
  } else if (parts[0] === "土日") {
    return `0 ${minute} ${hour} * * 0,6`;
  } else if (parts[0].includes("から")) {
    const startDay = weekdays.indexOf(parts[0].split("から")[0]);
    const endDay = weekdays.indexOf(parts[0].split("から")[1]);
    return `${minute} ${hour} * * ${startDay}-${endDay}`;
  } else if (weekdays.includes(parts[0])) {
    const dayOfWeek = weekdays.indexOf(parts[0]);
    return `0 ${minute} ${hour} * * ${dayOfWeek}`;
  }

  throw new Error("Invalid expression");
}

const updateCron = ({ message, userId }) => {
  const newCronExpression = createCronExpression(message);
  users.forEach((user) => {
    if (user.userId === userId) {
      user.cronExpression.push(newCronExpression);
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
    console.log(parts);
    const minute = parts[1];
    const hour = parts[2];
    // const dayOfMonth = parts[3];
    // const month = parts[4];
    const dayOfWeek = parts[5];

    let message = "毎週";
    if (dayOfWeek === "1-5") {
      message += "平日";
    } else if (dayOfWeek === "0,6") {
      message += "土日";
    } else {
      message += dayOfWeek
        .split(",")
        .map((value) => weekdays[value])
        .join("と");
    }
    console.log(message);
    // 時間によってメッセージを構築する
    message += `の${hour}時`;
    if (minute !== "0") {
      message += `${minute}分`;
    }

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
};
