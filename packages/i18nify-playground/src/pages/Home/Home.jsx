import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { Box, Heading, Link, Text } from '@razorpay/blade/components';
import { MODULES } from 'src/pages/Home/constants';
import './globe.css';
import { useMobile } from 'src/hooks/useMobile';

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  return (
    <Box>
      <Helmet>
        <title> i18nify </title>
      </Helmet>
      <Box>
        <Box
          display="flex"
          rowGap="spacing.4"
          flexDirection="column"
          paddingTop="spacing.7"
          paddingBottom="spacing.7"
        >
          <Heading size="2xlarge" color="surface.text.primary.normal">
            Welcome to Geo Smart ! 🚀
          </Heading>

          <Heading as="h4">
            A one-stop solution for all your internationalization needs. Hey,
            dive into this extensive toolkit—it’s like having a magic kit for
            your app! 🪄✨ Picture this: modules for phoneNumber, currency,
            date—they’re like enchanted tools that make your app talk fluently
            in any language, anywhere! It’s your ticket to making your app a
            global citizen, no matter where it goes! And hey, hang tight—I’ll
            break down each of these enchanting modules in the sections coming
            up! 🌍📱💸🗓️
          </Heading>
        </Box>

        <Box
          padding="spacing.3"
          display="grid"
          gridTemplateColumns={isMobile ? '1fr 1fr' : '1fr 1fr 1fr'}
          alignItems="start"
          width="100%"
          rowGap={isMobile ? 'spacing.4' : 'spacing.0'}
        >
          <Box>
            <Heading size="large">Modules</Heading>
            <Box
              display="flex"
              flexDirection="column"
              flexWrap="wrap"
              rowGap="spacing.2"
            >
              {MODULES.map((module) => {
                return (
                  <Link
                    color="primary"
                    onClick={() => navigate(module.navigatePath)}
                  >
                    {module.title}
                  </Link>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Heading size="large">Plugins</Heading>
            <Box
              display="flex"
              flexDirection="column"
              flexWrap="wrap"
              rowGap="spacing.2"
            >
              <Link
                onClick={() =>
                  window.open(
                    'https://www.npmjs.com/package/@razorpay/i18nify-react',
                    '_blank',
                  )
                }
                color="primary"
              >
                i18nify-react
              </Link>
            </Box>
          </Box>

          <Box>
            <Heading size="large">Other Langauges (Coming soon)</Heading>
            <Box
              display="flex"
              flexDirection="column"
              flexWrap="wrap"
              rowGap="spacing.2"
            >
              <Box>
                <Text>i18nify-go</Text>
              </Box>
              <Box>
                <Text>i18nify-java</Text>
              </Box>
              <Box>
                <Text>i18nify-php</Text>
              </Box>
              <Box>
                <Text>i18nify-python</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
