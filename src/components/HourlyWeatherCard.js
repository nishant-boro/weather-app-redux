const iconSrcGenerator = (weather) => {
  return `http://openweathermap.org/img/w/${weather}.png`;
};

const getTimeInterval = (item) => {
  const splittedDateTime = item.dt_txt.split(" ");
  const date = splittedDateTime[0];
  const time = splittedDateTime[1];
  const newTime = parseInt(time.split(":")[0]) + 3;

  return date + " " + time + " - " + newTime + ":00:00";
};

const HourlyWeatherCard = ({ data }) => (
  <div className="container">
    {data.map((item, idx) => {
      return (
        <div key={idx} className="hourly-weather-card">
          <div>{getTimeInterval(item)}</div>
          <img
            className="icon mx-auto"
            src={iconSrcGenerator(item.weather[0].icon)}
          />
          <div>{console.log(item)}</div>
          <div className="font-weight-bold">
            {parseInt(item.main.temp_min)}&deg; &nbsp;
            <small>{parseInt(item.main.temp_max)}&deg;</small>
          </div>
        </div>
      );
    })}
  </div>
);

export { HourlyWeatherCard };
