import { useEffect } from 'react';
import { useI18nContext } from '@razorpay/i18nify-react';

import Box from '@mui/material/Box';
import { Select, MenuItem } from '@mui/material';

import { LANGS } from 'src/constants/locale';

export default function LanguagePopover() {
  const { setI18nState, i18nState } = useI18nContext();

  useEffect(() =>{
    if (i18nState.locale.length === 0) {
      setI18nState( { locale: 'en-IN' });
    }
  }, [i18nState, setI18nState]);

  return (
    <Select
      size="small"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 0,
          mt: 1,
          ml: 0.75,
          width: 180,
        },
      }}
      value={i18nState.locale}
      onChange={(ev) => {
        setI18nState({ locale: ev.target.value });
      }}
    >
      {LANGS.map((option) => (
        <MenuItem
          key={option.value}
          selected={option.value === LANGS[0].value}
          sx={{ typography: 'body2', py: 1 }}
          value={option.value}
        >
          <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
        </MenuItem>
      ))}
    </Select>
  );
}
