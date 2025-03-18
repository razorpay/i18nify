import React from 'react';

import {
  Box,
  Grid,
  useTheme,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';

import SvgColor from '../../components/svg-color';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigateToExternal = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#305EFF17',
      }}
    >
      <Container>
        <Grid
          container
          spacing={isMobile ? 2 : 0}
          paddingY={2}
          display="flex"
          alignItems="center"
          sx={{ marginX: isMobile ? 0 : '-24px' }}
        >
          <Grid
            item
            xs={12}
            sm={4}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Typography>©2024 Razorpay</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            display="flex"
            alignItems="center"
            justifyContent={isMobile ? 'flex-start' : 'center'}
          >
            <Typography>Developed and designed by Razorpay</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={isMobile ? 'flex-start' : 'flex-end'}
            >
              <SvgColor
                onClick={() =>
                  navigateToExternal('https://github.com/razorpay/i18nify/')
                }
                src="/assets/icons/ic_github.svg"
                sx={{
                  width: 30,
                  height: 30,
                  background: '#6b6b6b',
                  cursor: 'pointer',
                }}
              />
              <img
                onClick={() => {
                  navigateToExternal(
                    'https://www.npmjs.com/package/@razorpay/i18nify-js',
                  );
                }}
                src="/assets/icons/ic_npm.svg"
                style={{
                  height: 30,
                  background: '#CC3534',
                  cursor: 'pointer',
                  marginLeft: 24,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
