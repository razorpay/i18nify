import Container from '@mui/material/Container';
import { Box, Grid, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import CodeEditor from 'src/components/codeEditor';
import { getCurrencyList } from '@razorpay/i18nify-js';

// ----------------------------------------------------------------------

export default function GetCurrencyList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const data = getCurrencyList();
  const currencyList = Object.keys(data).map((currency) => ({ ...data[currency] }));

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetCurrencyList
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍💰 It’s your easy-peasy way to snag a whole list of currencies with their symbols and
            names. Simple, straightforward, and totally handy!
          </Typography>
        </Grid>

        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '200px' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '200px', width: '100%', padding: '20px 0px' }}>
                <CodeEditor value={JSON.stringify(getCurrencyList(), null, 2)} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={!isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }}
        >
          <Typography variant="h5">Currency List</Typography>
          <Select
            size="small"
            defaultValue={currencyList[0].name}
            sx={{
              height: '57px',
              marginRight: 1,
              width: '100%',
            }}
          >
            {currencyList.map((currency) => (
              <MenuItem key={currency.name} value={currency.name}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textOverflow: 'initial',
                  }}
                >
                  <div width="30px">
                    {currency.symbol} - {currency.name}
                  </div>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '60vh' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '100%', width: '100%', padding: '0px 20px' }}>
                <CodeEditor value={JSON.stringify(getCurrencyList(), null, 2)} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
