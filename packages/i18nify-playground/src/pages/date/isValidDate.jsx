import { useState } from 'react';
import { isValidDate } from '@razorpay/i18nify-js';
import dayjs from 'dayjs';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery, TextField } from '@mui/material';

import DateForm from 'src/sections/date/date-form';

// ----------------------------------------------------------------------

export default function IsValidDate() {
  const [inpValue, setInpValue] = useState(dayjs(new Date()));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isValid = isValidDate(`${new Date(inpValue)}`);
  const infoMessage = isValid ? 'Valid Date' : 'Invalid Date';

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            IsValidDate
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🕵️‍♂️🗓️ The isValidDate function now comes with an international flair! It’s a robust date
            validator that not only checks if a date is valid but also ensures it aligns with the
            date format of a specific locale. Perfect for applications catering to a global
            audience, it scrutinizes dates against various international formats, making it a
            versatile tool in your date validation arsenal. 🌍⏳
          </Typography>
        </Grid>
        <Grid
          item
          xs={isMobile ? 12 : 7}
        >
          <DateForm
            infoMessage={infoMessage}
            isValid={isValid}
            utilName="isValidDate"
            inpValue={dayjs(inpValue)}
            onInpChange={(val) => {
              setInpValue(dayjs(new Date(val)));
            }}
            includeIntlOptions={false}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
