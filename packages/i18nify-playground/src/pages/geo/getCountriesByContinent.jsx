import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAllContinents, getCountriesByContinent } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';
import CodeEditor from 'src/components/codeEditor';
import CountryDropdown from 'src/components/countryDropdown';
import ContinentDropdown from 'src/components/continentDropdown';

// ----------------------------------------------------------------------

export default function GetCountriesByContinent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [code, setCode] = useState('');
  const [continentVal, setContinentVal] = useState('');
  const [continentList, setContinentList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [countryInp, setCountryInp] = useState('');

  useEffect(() => {
    getAllContinents().then((res) => {
      setCode(JSON.stringify(res, null, 2));
      const data = Object.keys(res).map((continent) => ({
        code: continent,
        name: res[continent].name,
      }));
      setContinentList(data);
    });
  }, []);

  useEffect(() => {
    getCountriesByContinent(continentVal).then((res) => {
      setCode(JSON.stringify(res, null, 2));
      setCountryList(res);
      setCountryInp(res[0].code || res[1].code);
    });
  }, [continentVal]);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetCountriesByContinent
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍 Want to explore countries by continent? Meet getCountriesByContinent! This savvy
            function lets you delve into specific continents, unlocking a trove of countries waiting
            to be discovered. Whether you're curious about Africa, Asia, or any other continent,
            just call this function and let the geographical journey begin! 🗺️🔍
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
          <ContinentDropdown
            list={continentList}
            value={continentVal}
            onChange={(continent) => setContinentVal(continent)}
          />
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
