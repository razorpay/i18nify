// Run from the repo root: yarn optimize-flags
// Optimises i18nify-data/assets/flags/{4x3,1x1}/*.svg in place. svgo's
// preset-default keeps viewBox (consumers scale flags with it) and width/height.
import path from 'node:path';

export default {
  multipass: true,
  plugins: [
    'preset-default',
    {
      // Flags are often inlined several to a page; make mask/clipPath ids
      // unique per file and size (e.g. "in_4x3__a") so they cannot collide.
      name: 'prefixIds',
      params: {
        prefix: (_node, info) => {
          const file = info.path ?? '';
          return `${path.basename(file, '.svg')}_${path.basename(path.dirname(file))}`;
        },
      },
    },
  ],
};
