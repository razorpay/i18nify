import React from 'react';

import { MENU_ITEM_PLACEHOLDER_CONTENT } from 'src/constants/geo';
import { ActionListItem } from '@razorpay/blade/components';

const PlaceholderMenuItem = (props) => {
  const { content = MENU_ITEM_PLACEHOLDER_CONTENT } = props;
  return <ActionListItem title={content} value={content} isDisabled />;
};

export default PlaceholderMenuItem;
