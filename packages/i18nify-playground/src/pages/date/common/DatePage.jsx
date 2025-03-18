import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
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
      <LayoutHeader title={title} description={description} />
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
