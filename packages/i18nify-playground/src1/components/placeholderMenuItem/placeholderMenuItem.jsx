import React from 'react';
import { MenuItem } from '@mui/material';

import { MENU_ITEM_PLACEHOLDER_CONTENT } from 'src/constants/geo';

const PlaceholderMenuItem = (props) => {
  const { content = MENU_ITEM_PLACEHOLDER_CONTENT } = props;
  return <MenuItem disabled>{content}</MenuItem>;
};

export default PlaceholderMenuItem;
