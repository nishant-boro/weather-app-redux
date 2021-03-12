import { createStore, combineReducers } from "redux";
import weatherData from "./reducers/weatherData";

const rootReducer = combineReducers({
  data: weatherData,
});

export default createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
