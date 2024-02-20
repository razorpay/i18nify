import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import { Box, Grid, Link, Typography } from '@mui/material';

import navConfig from 'src/layouts/dashboard/config-navigation';

// ----------------------------------------------------------------------

export default function NumberView() {
  const navigate = useNavigate();
  const numberLinks = navConfig.find((item) => item.path.toLowerCase().includes('number')).children;

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
          Currency & Number module
        </Typography>

        <Grid item xs={10}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            This module's your go-to guru for everything currency/number-related. 🤑 It's all about
            formatting, validations, and handy tricks to make dealing with money/numbers a breeze.
            Here are the cool APIs and utilities this Currency Module gives you to play with! 🚀💸
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            APIs
          </Typography>
          {numberLinks.map((link) => (
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
