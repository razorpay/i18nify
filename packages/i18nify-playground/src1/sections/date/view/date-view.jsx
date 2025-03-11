import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import { Box, Grid, Link, Typography } from '@mui/material';

import navConfig from 'src/layouts/dashboard/config-navigation';

// ----------------------------------------------------------------------

export default function DateView() {
  const navigate = useNavigate();
  const dateLinks = navConfig.find((item) => item.title.toLowerCase() === 'date').children;

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
          Date module
        </Typography>

        <Grid item xs={10}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            This module 🧩 leverages the JavaScript Intl API & Date object 📆 to offer developers
            locale-aware tools 🛠️ for formatting and manipulating dates and times ⏳ in a
            user-friendly way.
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            APIs
          </Typography>
          {dateLinks.map((link) => (
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
