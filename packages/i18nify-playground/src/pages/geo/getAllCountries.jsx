import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAllCountries } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';
import CodeEditor from 'src/components/codeEditor';
import CountryDropdown from 'src/components/countryDropdown';

// ----------------------------------------------------------------------

export default function GetAllCountries() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [code, setCode] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [countryInp, setCountryInp] = useState('');

  useEffect(() => {
    getAllCountries().then((res) => {
      setCode(JSON.stringify(res, null, 2));
      setCountryList(res);
      setCountryInp(res[0].code);
    });
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetAllCountries
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍 Ready to dive into the world of nations? Say hello to getAllCountries! This dynamic
            function is your gateway to a comprehensive list of countries spanning the globe. With
            just a simple call, you'll unlock a treasure trove of international data, perfect for
            any coding adventurer. 🗺️🚀
          </Typography>
        </Grid>

        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '200px' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '200px', width: '100%', padding: '20px 0px' }}>
                <CodeEditor value={code} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={!isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }}
        >
          <CountryDropdown
            label="Country List"
            list={countryList}
            value={countryInp}
            onChange={(country) => setCountryInp(country)}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '60vh' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '100%', width: '100%', padding: '0px 20px' }}>
                <CodeEditor value={code} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
