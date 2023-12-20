const loadPolyfills = async () => {
  // Check if the Intl object and Intl.NumberFormat function are available
  if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function') {
    const { default: intlFormatToPartsPolyfill } = await import(
      './intlFormatToPartsPolyfill'
    );
    intlFormatToPartsPolyfill();
  }
};

export default loadPolyfills;
