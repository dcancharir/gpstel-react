import React from 'react';
import ReactDOM from 'react-dom';
// core styles
import "./scss/volt.scss";

// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { HashRouter } from "react-router-dom";
ReactDOM.render(
  <HashRouter>
    <ScrollToTop />
    <HomePage/>
  </HashRouter>,
  document.getElementById('root')
);
