import { LANGUAGES } from 'src/context/constants';
import GoRoutes from 'src/Routes/GoRoutes';
import JSRoutes from 'src/Routes/JSRoutes';

export const ROUTER_MAP = {
  [LANGUAGES.GO]: GoRoutes,
  [LANGUAGES.JS]: JSRoutes,
};
