import { useNavigate } from 'react-router-dom';

import { Box, Heading, Link } from '@razorpay/blade/components';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';

export default function Overview({ title, description, apiItems }) {
  const navigate = useNavigate();

  return (
    <>
      <LayoutHeader title={title} description={description} />

      <Box display="flex" flexDirection="column" rowGap="spacing.3">
        <Heading size="large">APIs</Heading>
        {apiItems.map((link) => (
          <Box key={link.path}>
            <ul>
              <li>
                <Link onClick={() => navigate(link.path)}>{link.title}</Link>
              </li>
            </ul>
          </Box>
        ))}
      </Box>
    </>
  );
}
