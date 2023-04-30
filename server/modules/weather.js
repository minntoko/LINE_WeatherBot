const request = require("request");
const { weatherFlexMessages } = require("./flexmessage.js");

const options = (city) => {
  return {
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${process.env.API_KEY}`,
    method: "GET",
    json: true,
  };
};

const convertWeather = (weather) => {
  // TODO 調べる
  const weatherDict = {
    Clouds: "曇り☁️",
    Clear: "晴れ☀️",
    Rain: "雨🌧️",
    Snow: "雪⛄️",
    Extreme: "荒れた天気🌪️",
  };
  const converted = weatherDict[weather];
  return converted ? converted : weather;
};

const getWeather = async (city) => {
  const response = await new Promise((resolve, reject) => {
    request(options(city), (error, res, body) => {
      error ? reject(error) : resolve(body);
    });
  });

  console.log(response);

  const temp_max = response.main.temp_max.toFixed(1);
  const temp_min = response.main.temp_min.toFixed(1);
  const temp = response.main.temp.toFixed(1);
  const weather = convertWeather(response.weather[0].main);

  return `現在の${response.name}の天気は${weather}です。気温は${temp}°Cです。`;
};

const getWeatherFlex = async (city) => {
  const response = await new Promise((resolve, reject) => {
    request(options(city), (error, res, body) => {
      error ? reject(error) : resolve(body);
    });
  });

  console.log(response);

  const temp_max = response.main.temp_max.toFixed(1);
  const temp_min = response.main.temp_min.toFixed(1);
  const temp = response.main.temp.toFixed(1);
  const weather = convertWeather(response.weather[0].main);

  const regionContents = weatherFlexMessages({city: response.name, weather: weather, temp: temp});

  return regionContents;
};

module.exports = {
  getWeather: getWeather,
  getWeatherFlex: getWeatherFlex,
};
