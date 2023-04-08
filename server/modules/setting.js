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

module.exports = {
  users: users,
}