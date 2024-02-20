import Container from '@mui/material/Container';
import { Box, Grid, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAllCountries, getCities, getStatesByCountry, setState } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';
import { ALLOWED_COUNTRIES } from 'src/constants/geo';
import CodeEditor from 'src/components/codeEditor';
import CountryDropdown from 'src/components/countryDropdown';
import StateDropdown from 'src/components/stateDropdown';

// ----------------------------------------------------------------------

export default function GetCities() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [code, setCode] = useState('');
  const [countryInp, setCountryInp] = useState('IN');
  const [countryList, setCountryList] = useState([]);
  const [stateInp, setStateInp] = useState('');
  const [stateList, setStateList] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityInp, setCityInp] = useState('');

  useEffect(() => {
    getAllCountries().then((res) =>
      setCountryList(res.filter((country) => ALLOWED_COUNTRIES.includes(country.code)))
    );
  }, []);

  useEffect(() => {
    setStateInp('');
    setCode('');
    getStatesByCountry(countryInp).then((res) => {
      const states = Object.entries(res).map(([_code, state]) => ({
        code: _code,
        name: state.name,
      }));
      setStateList(states);
    });
  }, [countryInp]);

  useEffect(() => {
    if (!stateInp) return;
    getCities(countryInp, stateInp).then((res) => {
      setCities(res);
      setCityInp(res[0]);
      setCode(JSON.stringify(res, null, 2));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateInp]);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetCities
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🏙️ Ready to navigate cities with precision? Say hello to getCities! This ingenious
            function empowers you to explore cities based on country and state codes, unleashing a
            world of urban excitement at your fingertips. Whether you're hunting for the pulse of
            New York or the charm of Tokyo, just call this function and let the cityscape adventure
            begin! 🗺️🌆
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
            value={countryInp}
            list={countryList}
            onChange={(country) => setCountryInp(country)}
          />
          <StateDropdown value={stateInp} onChange={(e) => setStateInp(e)} list={stateList} />

          <Typography variant="h5">List of Cities</Typography>
          <Select
            size="small"
            value={cityInp}
            sx={{
              height: '57px',
              marginRight: 1,
              width: '100%',
            }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textOverflow: 'initial',
                  }}
                >
                  <div width="30px">{city}</div>
                </Box>
              </MenuItem>
            ))}
          </Select>
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
