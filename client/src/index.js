import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Provider } from 'react-redux'
import store from "./config/redux/store"

import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);

