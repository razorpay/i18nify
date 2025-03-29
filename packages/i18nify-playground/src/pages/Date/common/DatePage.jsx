import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import {
  getDateTimeSupportedLocals,
  getSupportedLocalsObjectStructure,
} from 'src/components/LocalDropdown/utils';
import DateForm from 'src/pages/Date/common/DateForm';

const DatePage = ({
  utilName,
  inpValue,
  isSmallEditor = true,
  onInpChange,
  code,
  title,
  description,
}) => {
  return (
    <>
      <LayoutHeader
        title={title}
        description={description}
        showLocalDropdown
        supportedLocals={getSupportedLocalsObjectStructure(
          getDateTimeSupportedLocals(),
        )}
      />
      <DateForm
        utilName={utilName}
        isSmallEditor={isSmallEditor}
        inpValue={inpValue}
        onInpChange={onInpChange}
        code={code}
      />
    </>
  );
};

export default DatePage;
