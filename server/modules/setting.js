const users = [
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 0 9,21 * * Mon-Fri", "0 0 10,23 * * Sat-Sun"],
    region: "Nagoya",
    enabled: true,
  },
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 59 23 * * Wed"],
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

function createCronExpression(expression) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  const parts = expression
    .replace(/曜日/g, "")
    .replace(/毎週/g, "")
    .replace(/分/g, "")
    .replace(/と/g, ",")
    .replace(/から/g, "-")
    .replace(/時に通知して/g, "")
    .split("の");

  let minute = parts[1].split(/(?:時|:|：)/)[1];
  let hour = parts[1].split(/(?:時|:|：)/)[0];

  if (parts[0] === "平日") {
    return `0 ${minute} ${hour} * * 1-5`;
  } else if (parts[0] === "土日") {
    return `0 ${minute} ${hour} * * 0,6`;
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

module.exports = {
  users: users,
  updateUser: updateUser,
  convertCityName: convertCityName,
  reverseConvert: reverseConvert,
};
