import { Helmet } from 'react-helmet-async';

import { DateView } from 'src/sections/date/view';

// ----------------------------------------------------------------------

export default function DatePage() {
  return (
    <>
      <Helmet>
        <title> i18nify | Date </title>
      </Helmet>

      <DateView />
    </>
  );
}
