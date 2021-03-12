import React from "react";

const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

const getDay = (date) => {
  var dateObj = new Date(date);
  return weekday[dateObj.getDay()];
};

const iconSrcGenerator = (weather) => {
  return `http://openweathermap.org/img/w/${weather}.png`;
};

const DailyWeatherCard = ({ forecast, handler }) => (
  <div
    onClick={(event) => handler(forecast.name)}
    className="daily-weather-card"
  >
    <div>{getDay(forecast.name)}</div>
    <img
      className="icon mx-auto"
      src={iconSrcGenerator(forecast.dailyWeatherData.weather)}
    />
    <div className="font-weight-bold">
      {parseInt(forecast.dailyWeatherData.max)}&deg; &nbsp;
      <small>{parseInt(forecast.dailyWeatherData.min)}&deg;</small>
    </div>
  </div>
);

export { DailyWeatherCard };
