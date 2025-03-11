import { Helmet } from 'react-helmet-async';

import { NumberView } from 'src/sections/number/view';

// ----------------------------------------------------------------------

export default function NumberPage() {
  return (
    <>
      <Helmet>
        <title> i18nify | Number </title>
      </Helmet>

      <NumberView />
    </>
  );
}
