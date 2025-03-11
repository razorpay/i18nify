import { ToastContainer } from '@razorpay/blade/components';
import React from 'react';
import { useLanguageContext } from 'src/context/languagesContext';
import { ROUTER_MAP } from 'src/Routes/constants';
import { GlobalStyles } from 'src/styles';

const App = () => {
  const { selectedLanguage } = useLanguageContext();
  const Router = ROUTER_MAP[selectedLanguage];

  return (
    <>
      <ToastContainer />
      <GlobalStyles />
      <Router />
    </>
  );
};

export default App;
