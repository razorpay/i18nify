// Run from the repo root: yarn optimize-flags
// Optimises i18nify-data/assets/flags/*.svg in place. svgo's preset-default
// keeps viewBox (consumers scale flags with it) and width/height.
export default {
  multipass: true,
  plugins: [
    'preset-default',
    // Flags are often inlined several to a page; make mask/clipPath ids
    // unique per file (e.g. "in_svg__a") so they cannot collide.
    'prefixIds',
  ],
};
