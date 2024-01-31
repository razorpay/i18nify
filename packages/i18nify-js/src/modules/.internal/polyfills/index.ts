const loadPolyfills = async () => {
  if (
    typeof Intl !== 'undefined' &&
    typeof Intl.NumberFormat === 'function' &&
    typeof Intl.NumberFormat().formatToParts !== 'function'
  ) {
    const { default: intlFormatToPartsPolyfill } = await import(
      './intlFormatToPartsPolyfill'
    );
    intlFormatToPartsPolyfill();
  }

  // Add other polyfills here in similar fashion as above
};

export default loadPolyfills;
