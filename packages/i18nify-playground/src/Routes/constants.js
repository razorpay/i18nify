import { LANGUAGES } from 'src/context/constants';
import JSRoutes from 'src/Routes/JSRoutes';

export const ROUTER_MAP = {
  [LANGUAGES.GO]: null,
  [LANGUAGES.JS]: JSRoutes,
};
