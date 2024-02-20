import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAllContinents } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';
import CodeEditor from 'src/components/codeEditor';
import ContinentDropdown from 'src/components/continentDropdown';

// ----------------------------------------------------------------------

export default function GetAllContinents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [code, setCode] = useState('');
  const [continentList, setContinentList] = useState([]);
  const [continentInp, setContinentInp] = useState('');

  useEffect(() => {
    getAllContinents().then((res) => {
      setCode(JSON.stringify(res, null, 2));
      const data = Object.keys(res).map((continent) => ({
        code: continent,
        name: res[continent].name,
      }));
      setContinentList(data);
      setContinentInp(data[0].code);
    });
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetAllContinents
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍 Seeking global domination? Look no further than getAllContinents! This ingenious
            function is your map to all seven continents, neatly packaged for your coding pleasure.
            No need to pack your bags—just fire up your IDE and let the exploration begin! 🗺️✨
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
            label="Continent List"
            list={continentList}
            value={continentInp}
            onChange={(e) => setContinentInp(e)}
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
