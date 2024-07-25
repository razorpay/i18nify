import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Link,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Globe from 'src/components/globe';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Helmet>
        <title> i18nify </title>
      </Helmet>
      <Grid container>
        <Typography
          sx={{
            mb: 2,
            fontSize: '72px',
            fontStyle: 'normal',
            lineHeight: '78px',
            color: '#305EFF',
          }}
          variant="h1"
        >
          Welcome to Geo Smart ! 🚀
        </Typography>

        <Grid item xs={12} sm={10} sx={{ mb: 2 }}>
          <Typography variant="body1">
            A one-stop solution for all your internationalization needs. Hey,
            dive into this extensive toolkit—it’s like having a magic kit for
            your app! 🪄✨ Picture this: modules for phoneNumber, currency,
            date—they’re like enchanted tools that make your app talk fluently
            in any language, anywhere! It’s your ticket to making your app a
            global citizen, no matter where it goes! And hey, hang tight—I’ll
            break down each of these enchanting modules in the sections coming
            up! 🌍📱💸🗓️
          </Typography>
        </Grid>

        <Grid container sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6}>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Modules
              </Typography>
              <Box>
                <Link
                  color="#2950DA"
                  component="button"
                  underline="none"
                  onClick={() => navigate('/number')}
                >
                  Number
                </Link>
              </Box>
              <Box>
                <Link
                  color="#2950DA"
                  component="button"
                  underline="none"
                  onClick={() => navigate('/phone')}
                >
                  Phone Number
                </Link>
              </Box>
              <Box>
                <Link
                  color="#2950DA"
                  component="button"
                  underline="none"
                  onClick={() => navigate('/date')}
                >
                  Date
                </Link>
              </Box>
              <Box>
                <Link
                  color="#2950DA"
                  component="button"
                  underline="none"
                  onClick={() => navigate('/geo')}
                >
                  Geo
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Plugins
              </Typography>
              <Box>
                <Link
                  component="button"
                  underline="none"
                  onClick={() =>
                    window.open(
                      'https://www.npmjs.com/package/@razorpay/i18nify-react',
                      '_blank',
                    )
                  }
                  color="#2950DA"
                >
                  i18nify-react
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Other Langauges (Coming soon)
              </Typography>
              <Box>
                <Link component="button" underline="none" color="#2950DA">
                  i18nify-go
                </Link>
              </Box>
              <Box>
                <Link component="button" underline="none" color="#2950DA">
                  i18nify-java
                </Link>
              </Box>
              <Box>
                <Link component="button" underline="none" color="#2950DA">
                  i18nify-php
                </Link>
              </Box>
              <Box>
                <Link component="button" underline="none" color="#2950DA">
                  i18nify-python
                </Link>
              </Box>
            </Grid>
          </Grid>

          {!isMobile && (
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div className="globe">
                <Globe />
              </div>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
