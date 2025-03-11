import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import { Box, Grid, Link, Typography } from '@mui/material';

import navConfig from 'src/layouts/dashboard/config-navigation';

// ----------------------------------------------------------------------

export default function GeoView() {
  const navigate = useNavigate();
  const geoLinks = navConfig.find((item) => item.title.toLowerCase() === 'geo').children;

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
          Geo module
        </Typography>

        <Grid item xs={10}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Welcome to the Geo Package 🚀, your all-in-one, supercharged toolkit for sprinkling some
            geographical magic 🧙‍♂️ into your applications! Whether you're looking to jazz up your UI
            with some snazzy SVG flags 🏁, or you need the nitty-gritty details of continents,
            countries, states, cities, and zip codes, we've got you covered!
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            APIs
          </Typography>
          {geoLinks.map((link) => (
            <Box key={link.path}>
              <Link
                color="#4767FD"
                component="button"
                underline="none"
                onClick={() => navigate(link.path)}
              >
                {link.title}
              </Link>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
