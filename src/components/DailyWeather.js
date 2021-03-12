import React, { Component } from "react";
import { DailyWeatherCard } from "./DailyWeatherCard";
import { HourlyWeatherCard } from "./HourlyWeatherCard";
import setWeatherData from "../actions/setWeatherData";
import { connect } from "react-redux";

const API_KEY = "";
const GET_LAT_LONG_API_KEY = "";

class DailyWeather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingData: false,
      showHourlyData: false,
      pickedDate: "",
      searchCity: "",
      lat: "",
      long: "",
      errors: false,
    };
  }

  arrangeData = (list) => {
    const dates = list
      .map((item, i) => {
        return item.dt_txt.split(" ")[0];
      })
      .filter((item, i, currArr) => {
        return currArr.indexOf(item) === i;
      });

    console.log(dates);
    let sortedResults = [];
    for (let theDate of dates) {
      sortedResults.push({
        name: theDate,
        hourlyWeatherData: [],
        dailyWeatherData: {},
      });
    }

    // for each item in the json.list
    for (let item of list) {
      let itemDate = item.dt_txt.split(" ")[0]; // get the date in string form

      //if sortedResults.name = itemDate then push that item into that sortedResult's weathers array
      for (let result of sortedResults) {
        if (result.name === itemDate) {
          result.hourlyWeatherData.push(item);
        }
      }
    }

    // console.log('sortedResults', sortedResults);
    return sortedResults;
  };

  search = () => {
    this.props.setWeatherData([]);

    this.setState((prevState) => {
      prevState.loadingData = true;
      prevState.errors = false;
      prevState.showHourlyData = false;

      return {
        ...prevState,
      };
    });

    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${this.state.searchCity}&key=${GET_LAT_LONG_API_KEY}`,
      { method: "GET" }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const res = json.results;

        if (res && res.length >= 1) {
          this.state.lat = res[0].geometry.lat;
          this.state.long = res[0].geometry.lng;
          // fetch hourly data
          return fetch(
            `http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.lat}&lon=${this.state.long}&units=metric&appid=${API_KEY}`,
            { method: "GET" }
          );
        } else {
          throw "Unable to find city";
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.props.setWeatherData(this.arrangeData(json.list));

        if (json.cod == "200") {
          return fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.long}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`,
            { method: "GET" }
          );
        } else {
          throw "City hourly weather data not found";
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const res = json.daily;
        var idx = 0;

        if (res && res.length >= 1) {
          for (let item of this.state.arrangedData) {
            const day = res[idx++];

            item.dailyWeatherData.min = day.temp.min;
            item.dailyWeatherData.max = day.temp.max;
            item.dailyWeatherData.weather = day.weather[0].icon;
          }
        } else {
          throw "City daily weather data not found";
        }
      })
      .catch((err) => {
        this.setState((prevState) => {
          prevState.errors = true;

          return {
            ...prevState,
          };
        });
        const element = document.getElementsByClassName("error-class")[0];

        element.innerHTML = err;
      })
      .finally(() => {
        this.setState((prevState) => {
          prevState.loadingData = false;

          return {
            ...prevState,
          };
        });
      });
  };

  updateShowHourlyState = (date) => {
    // console.log(date);
    this.setState((prevState) => {
      if (prevState.showHourlyData == false) {
        prevState.showHourlyData = true;
      } else {
        prevState.showHourlyData = false;
      }

      prevState.pickedDate = date;

      return {
        ...prevState,
      };
    });
  };

  getHourlyData = () => {
    const date = this.state.pickedDate;

    for (let item of this.props.weatherData) {
      if (item.name == date) {
        return item.hourlyWeatherData;
      }
    }
  };

  render() {
    return (
      <div>
        <h2>Search by city:</h2>

        <input
          className="input"
          onChange={(e) => this.setState({ searchCity: e.target.value })}
          value={this.state.searchCity}
        />
        <button onClick={this.search} disabled={!this.state.searchCity}>
          Submit
        </button>

        {this.state.errors ? <div className="error-class"></div> : ""}

        <div className="container">
          {!this.state.loadingData &&
            this.props.weatherData &&
            this.props.weatherData((data, idx) => {
              return (
                <DailyWeatherCard
                  forecast={data}
                  handler={this.updateShowHourlyState}
                  key={idx}
                />
              );
            })}
        </div>
        {this.state.showHourlyData ? (
          <HourlyWeatherCard data={this.getHourlyData()} />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    weatherData: state.weatherData,
  };
};

const mapDispatchToProps = {
  setWeatherData: setWeatherData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyWeather);
