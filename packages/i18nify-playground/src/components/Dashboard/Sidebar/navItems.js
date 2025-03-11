import { GO_NAV_ITEMS } from 'src/components/Dashboard/Sidebar/GoNavItems';
import { JS_NAV_ITEMS } from 'src/components/Dashboard/Sidebar/JSNavItems';
import { LANGUAGES } from 'src/context/constants';

export const NAV_ITEMS_MAP = {
  [LANGUAGES.JS]: JS_NAV_ITEMS,
  [LANGUAGES.GO]: GO_NAV_ITEMS,
};
