import Container from '@mui/material/Container';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CodeEditor from 'src/components/Generic/CodeEditor';
import { getDialCodes } from '@razorpay/i18nify-js';

// ----------------------------------------------------------------------

export default function GetDialCodes() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dialCodeList = getDialCodes();

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            getDialCodes
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍🔢 This function is a comprehensive directory of international
            dial codes, mapped to their respective country codes. Whether you're
            coding a global application or just need to reference international
            dialing formats, this function provides a quick and accurate
            reference, organizing the world's dial codes in a clean, easy-to-use
            format.
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
                <CodeEditor value={JSON.stringify(getDialCodes(), null, 2)} />
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
          <Typography variant="h5">DialCode List</Typography>
          <Select
            size="small"
            defaultValue={`US${dialCodeList.US}`}
            sx={{
              height: '57px',
              marginRight: 1,
              width: '100%',
            }}
          >
            {Object.keys(dialCodeList).map((countryCode) => (
              <MenuItem
                key={countryCode}
                value={`${countryCode}${dialCodeList[countryCode]}`}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textOverflow: 'initial',
                  }}
                >
                  <div width="30px">
                    {countryCode} - {dialCodeList[countryCode]}
                  </div>
                </Box>
              </MenuItem>
            ))}
          </Select>
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
                <CodeEditor value={JSON.stringify(getDialCodes(), null, 2)} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
