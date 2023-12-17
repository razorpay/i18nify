import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useI18nContext } from "@razorpay/i18nify-react";

function App() {
  console.log("🚀 ~ useI18nContext:", useI18nContext());
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
