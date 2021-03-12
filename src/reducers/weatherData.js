import { setWeatherData } from "../actions/setWeatherData";

const initialState = {
  weatherData: [],
};

function weatherData(state = initialState, action) {
  switch (action.type) {
    case "SET_WEATHER_DATA":
      return {
        weatherData: action.data,
      };
    default:
      return state;
  }
}

export default weatherData;
