import React, { useState } from 'react';

const withNumberHOC = (WrapperedComponent) => {
  return (props) => {
    const [inpValue, setInpValue] = useState('30');
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
