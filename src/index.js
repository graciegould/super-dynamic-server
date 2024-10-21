import React from "react";
import ReactDOM from "react-dom/client";
import "./css/main.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);

// Hot Module Replacement if ran on dev mode
// Learn more: https://webpack.js.org/guides/hot-module-replacement/
if (module.hot) {
  module.hot.accept();
}
