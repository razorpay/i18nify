import { getFlagsForAllCountries } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery, Box } from '@mui/material';
import SVG from 'react-inlinesvg';
import CodeEditor from 'src/components/Generic/CodeEditor';

// ----------------------------------------------------------------------

export default function GetFlagsForAllCountries() {
  const flags = getFlagsForAllCountries();
  const code = JSON.stringify(flags, null, 2);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetFlagsForAllCountries
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            Access a comprehensive collection of global flags with an ISO
            country code 🌍✈️—serving as your digital passport 🛂 to a visually
            unified world. This feature amplifies your app's international flair
            🌐 and celebrates cultural diversity 🏳️🔍 by embedding flags from
            every recognized nation.
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
          <Grid container>
            {Object.entries(flags).map(([countryCode, countrySvg]) => {
              return (
                <Grid item>
                  <Box
                    sx={{
                      margin: '10px',
                      display: 'flex',
                      'flex-direction': 'column',
                      'justify-content': 'center',
                      'align-items': 'center',
                    }}
                  >
                    <SVG
                      src={countrySvg.original}
                      width="60%"
                      height="auto"
                      title={countryCode}
                    />
                    <Typography variant="body1">{countryCode}</Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
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
