import { ToastContainer } from '@razorpay/blade/components';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageContext } from 'src/context/languagesContext';
import { ROUTER_MAP } from 'src/Routes/constants';
import { GlobalStyles } from 'src/styles';

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/i18nify-js');
    }
  }, []);

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
