const users = [
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 0 9,21 * * Mon-Fri", "0 0 10,23 * * Sat-Sun"],
    region: "Nagoya",
    enabled: true
  },
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 59 23 * * Wed"],
    region: "Tokyo",
    enabled: true
  },
];

// 地域変換テーブル
const cityNames = {
  "札幌": "Sapporo",
  "仙台": "Sendai",
  "東京": "Tokyo",
  "名古屋": "Nagoya",
  "大阪": "Osaka",
  "福岡": "Fukuoka",
  "那覇": "Naha",
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
}

// 地域を日本語に変換
const reverseConvert = (cityName) => {
  return reversedCityNames[cityName];
}

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
  const newUser = {
    userId: userId,
    cronExpression: [],
    region: "",
    enabled: true
  }
  users.push(newUser)
}

// 通知時間を更新

module.exports = {
  users: users,
  updateUser: updateUser,
  convertCityName: convertCityName,
  reverseConvert: reverseConvert
};
