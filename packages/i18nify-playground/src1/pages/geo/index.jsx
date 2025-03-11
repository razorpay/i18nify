import { Helmet } from 'react-helmet-async';

import { GeoView } from 'src/sections/geo/view';

// ----------------------------------------------------------------------

export default function GeoPage() {
  return (
    <>
      <Helmet>
        <title> i18nify | Geo </title>
      </Helmet>

      <GeoView />
    </>
  );
}
