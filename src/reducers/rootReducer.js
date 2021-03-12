const initialState = {
  weatherData: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_WEATHER_DATA":
      return {
        weatherData: action.data,
      };
    default:
      return state;
  }
};

export default rootReducer;
