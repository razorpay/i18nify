import { Box, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';

const ContinentDropdown = ({ label = 'Select Continent', value, onChange, list }) => {
  return (
    <>
      <Typography variant="h5">{label}</Typography>
      <Select
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          height: '57px',
          marginRight: 1,
          width: '100%',
          mb: 4,
        }}
      >
        {list.map((continent) => (
          <MenuItem key={continent.code} value={continent.code}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'initial',
              }}
            >
              <div width="30px">
                {continent.code} - {continent.name}
              </div>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default ContinentDropdown;
