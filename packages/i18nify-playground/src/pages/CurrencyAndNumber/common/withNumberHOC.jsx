import React, { useState } from 'react';

const withNumberHOC = (WrapperedComponent) => {
  return (props) => {
    const [inpValue, setInpValue] = useState('');
    const [currency, setCurrency] = useState('INR');
    return (
      <WrapperedComponent
        {...props}
        inpValue={inpValue}
        currency={currency}
        onCurrencyChange={(val) => setCurrency(val)}
        onInpChange={(val) => setInpValue(val)}
      />
    );
  };
};

export default withNumberHOC;
