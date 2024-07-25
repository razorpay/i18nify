import { Box, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';

const StateDropdown = ({ label = 'Select State', list, onChange, value }) => {
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
        {list.map((state) => (
          <MenuItem key={state.code} value={state.code}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'initial',
              }}
            >
              <div width="30px">
                {state.code} - {state.name}
              </div>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default StateDropdown;
