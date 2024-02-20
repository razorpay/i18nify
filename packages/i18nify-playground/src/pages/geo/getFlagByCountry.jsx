import { useState, useEffect } from 'react';
import { getFlagByCountry } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery, Select, MenuItem, Box } from '@mui/material';
import SVG from 'react-inlinesvg';

import { countryCodeMap } from 'src/sections/phoneNumber/data/phoneNumber';

// ----------------------------------------------------------------------

export default function GetFlagByCountry() {
  const [inpValue, setInpValue] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getFlagByCountry(countryCode).then((data) => {
      setInpValue(data);
    });
  }, [countryCode]);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetFlagByCountry
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🏳️‍🌈✨ Fetching country flags has never been easier! Just hand over a country code to this
            function, and it will retrieve the SVG content of the corresponding flag for you.
            Whether it's for displaying patriotic flair or for an international project, this
            function handles the lookup and ensures you get the exact visual representation of the
            nation's pride. In case it can't find the flag, it won't leave you hanging; it'll let
            you know something went wrong.
          </Typography>
        </Grid>

        {isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{
                height: '100px',
                'margin-bottom': '130px',
              }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <SVG src={inpValue} width="100%" height="auto" title={countryCode} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={!isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }}
        >
          <Select
            size="small"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            sx={{
              height: '57px',
              marginRight: 1,
              width: '100%',
            }}
          >
            {Object.entries(countryCodeMap).map(([code, name]) => (
              <MenuItem key={code} value={code}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textOverflow: 'initial',
                  }}
                >
                  <div width="30px">
                    {code} - {name}
                  </div>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <SVG src={inpValue} width="100%" height="auto" title={countryCode} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
