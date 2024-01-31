import React from 'react';
import './App.css';
import logo from './logo.svg';
import { useI18nContext } from '@razorpay/i18nify-react';
import { formatNumber } from '@razorpay/i18nify-js';

function App() {
  const { setI18nState } = useI18nContext();

  function handleChange() {
    setI18nState?.({ locale: 'de-DE' });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        Formatted Amount: {formatNumber(200000.34)}
        <button onClick={handleChange}>Change locale to german</button>
      </header>
    </div>
  );
}

export default App;
