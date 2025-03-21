import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import {
  getNumberSupportedLocals,
  getSupportedLocalsObjectStructure,
} from 'src/components/LocalDropdown/utils';
import NumberForm from 'src/pages/CurrencyAndNumber/common/NumberForm';

const NumberPage = ({
  includeIntlOptions = true,
  title,
  description,
  currency,
  inpValue,
  code,
  onInpChange,
  isSmallEditor = true,
  onCurrencyChange,
}) => {
  return (
    <>
      <LayoutHeader
        title={title}
        description={description}
        showLocalDropdown
        supportedLocals={getSupportedLocalsObjectStructure(
          getNumberSupportedLocals(),
        )}
      />

      <NumberForm
        inpValue={inpValue}
        currency={currency}
        isSmallEditor={isSmallEditor}
        code={code}
        onCurrencyChange={onCurrencyChange}
        onInpChange={onInpChange}
        includeIntlOptions={includeIntlOptions}
      />
    </>
  );
};

export default NumberPage;
