const dotenv = require("dotenv");
const request = require("request");
dotenv.config();

const options = (city = 'Nagoya') => {
  return {
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${process.env.API_KEY}`,
    method: "GET",
    json: true,
  };
};

const convertWeather = (weather) => {
  const weatherDict = {
    Clouds: "曇り",
    Sunny: "晴れ",
    Rain: "雨",
  };

  const matchedKey = Object.keys(weatherDict).find((key) => {
    const regex = new RegExp(key, "i");
    return regex.test(weather);
  });

  const converted = weatherDict[matchedKey];
  return converted ? converted : weather;
};

const getWeather = async (city) => {
  const response = await new Promise((resolve, reject) => {
    request(options(city), (error, res, body) => {
      error ? reject(error) : resolve(body);
    });
  });

  const temp_max = response.main.temp_max.toFixed(1);
  const temp_min = response.main.temp_min.toFixed(1);
  const temp = response.main.temp.toFixed(1);
  const weather = convertWeather(response.weather[0].main);

  return {
    type: "text",
    text: `現在の${response.name}の天気は${weather}です。気温は${temp}°Cです。`,
  };
};

module.exports = {
  getWeather: getWeather,
};
