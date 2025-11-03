import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Heading, Link, Text } from '@razorpay/blade/components';
import { useMobile } from 'src/hooks/useMobile';
import { MODULES } from 'src/pages/Home/constants';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();

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
            🌍 Your comprehensive internationalization toolkit across multiple
            programming languages! 🚀 Features include currency handling, phone
            number formatting, date-time operations, and geographical data
            management with locale support. 🔄 Perfect for apps needing global
            reach, the library provides consistent internationalization
            capabilities across JavaScript, Go, and upcoming support for Java,
            PHP, and Python. 💫 Includes extensive utilities for formatting,
            validation, and regional standards management across all supported
            languages. 🌐 A unified solution for handling international data
            formats and standards across your tech stack!
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
                    key={module.title}
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
            <Heading size="large">Other Languages (Coming soon)</Heading>
            <Box
              display="flex"
              flexDirection="column"
              flexWrap="wrap"
              rowGap="spacing.2"
            >
              {['go', 'java', 'php', 'python'].map((lang) => (
                <Box key={lang}>
                  <Text>i18nify-{lang}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
