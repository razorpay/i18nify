import { Helmet } from 'react-helmet-async';

import { PhoneNumberView } from 'src/sections/phoneNumber/view';

// ----------------------------------------------------------------------

export default function PhoneNumberPage() {
  return (
    <>
      <Helmet>
        <title> i18nify | Phone Number </title>
      </Helmet>

      <PhoneNumberView />
    </>
  );
}
