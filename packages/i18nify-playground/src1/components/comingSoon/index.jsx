import { Box, Typography } from '@mui/material';
import React from 'react';

const ComingSoon = () => {
  return (
    <Box display="flex" flex={1} alignItems="center" justifyContent="center">
      <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }} textAlign="center">
        Coming soon...
      </Typography>
    </Box>
  );
};

export default ComingSoon;
