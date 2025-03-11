import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAllCountries, getStates } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';
import { ALLOWED_COUNTRIES } from 'src/constants/geo';
import CodeEditor from 'src/components/Generic/CodeEditor';
import CountryDropdown from 'src/components/countryDropdown';
import StateDropdown from 'src/components/stateDropdown';

// ----------------------------------------------------------------------

export default function GetStates() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [code, setCode] = useState('');
  const [countryInp, setCountryInp] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [stateVal, setStateVal] = useState('');

  useEffect(() => {
    getAllCountries().then((res) =>
      setCountryList(
        res.filter((country) => ALLOWED_COUNTRIES.includes(country.code)),
      ),
    );
  }, []);

  useEffect(() => {
    setStateVal('');
    setStateList([]);
    getStates(countryInp).then((res) => {
      setCode(JSON.stringify(res, null, 2));
      const data = Object.keys(res).map((stateCode) => ({
        ...res[stateCode],
        code: stateCode,
      }));
      setStateList(data);
      setStateVal(data[0].code);
    });
  }, [countryInp]);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetStates
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍 Embark on a state-by-state discovery with the getStates API! Get
            access to a treasure trove of state information, including names,
            time zones, and even a list of vibrant cities within each state.
          </Typography>
        </Grid>

        {isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{ height: '200px' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                sx={{ height: '200px', width: '100%', padding: '20px 0px' }}
              >
                <CodeEditor value={code} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={
            !isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }
          }
        >
          <CountryDropdown
            value={countryInp}
            list={countryList}
            onChange={(country) => setCountryInp(country)}
          />
          <StateDropdown
            label="List of States"
            value={stateVal}
            list={stateList}
            onChange={(state) => setStateVal(state)}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid
              sx={{ height: '60vh' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                sx={{ height: '100%', width: '100%', padding: '0px 20px' }}
              >
                <CodeEditor value={code} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
