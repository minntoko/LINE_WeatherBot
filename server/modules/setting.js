const users = [
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 0 9,21 * * Mon-Fri", "0 0 10,23 * * Sat-Sun"],
    region: "Nagoya",
  },
  {
    userId: process.env.USER_ID1,
    cronExpression: ["0 0 22 * * Sat"],
    region: "Tokyo",
  },
];

const cityNames = {
  "札幌": "Sapporo",
  "仙台": "Sendai",
  "東京": "Tokyo",
  "名古屋": "Nagoya",
  "大阪": "Osaka",
  "福岡": "Fukuoka",
  "那覇": "Naha",
};

const reversedCityNames = {};
for (const key in cityNames) {
  const value = cityNames[key];
  reversedCityNames[value] = key;
}

const convertCityName = (cityName) => {
  const matchedKey = Object.keys(cityNames).find((key) => {
    const regex = new RegExp(key);
    return regex.test(cityName);
  });

  const converted = cityNames[matchedKey];
  return converted ? converted : null;
}

const reverseConvert = (cityName) => {
  return reversedCityNames[cityName];
}

const updateUser = (newUser) => {
  const targetUser = users.find((user) => {
    return user.userId == newUser.userId;
  });
  const updatedUser = { ...targetUser, ...newUser };
  Object.assign(targetUser, updatedUser);
  
  return updatedUser.region;
};

module.exports = {
  users: users,
  updateUser: updateUser,
  convertCityName: convertCityName,
  reverseConvert: reverseConvert
};
