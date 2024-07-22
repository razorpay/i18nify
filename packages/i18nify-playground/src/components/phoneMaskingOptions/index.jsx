import React from 'react';

import {
  Box,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PHONE_MASKING_INPUTS } from 'src/constants/phoneNumber';

const PhoneMaskingOptions = ({ maskingOptions, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (key, value) => {
    const newData = {
      ...maskingOptions,
      [key]: value,
    };
    onChange(newData);
  };

  const renderInput = (input) => {
    if (input.type === 'select') {
      return (
        <Grid container key={input.key} alignItems="center" spacing={1}>
          <Grid item xs={isMobile ? 5 : 4}>
            <Typography variant="body1">{input.label}</Typography>
          </Grid>
          <Grid item xs={isMobile ? 7 : 8}>
            <Select
              fullWidth
              size="small"
              label={input.label}
              value={maskingOptions[input.key]}
              onChange={(e) => handleInputChange(input.key, e.target.value)}
            >
              {input.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container key={input.key} alignItems="center">
        <Grid item xs={isMobile ? 5 : 4}>
          <Typography variant="body1">{input.label}</Typography>
        </Grid>
        <Grid item xs={isMobile ? 7 : 8}>
          <OutlinedInput
            type={input.type}
            fullWidth
            size="small"
            value={maskingOptions[input.key]}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography sx={{ mb: 2 }} variant="h5">
        Masking Options:
      </Typography>

      {PHONE_MASKING_INPUTS.map((input) => (
        <Box sx={{ mb: 2 }}>{renderInput(input)}</Box>
      ))}
    </Box>
  );
};

export default PhoneMaskingOptions;
