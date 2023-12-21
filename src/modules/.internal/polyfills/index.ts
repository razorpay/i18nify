const loadPolyfills = async () => {
  // Check if the Intl object and Intl.NumberFormat function are available
  if (
    !(
      typeof Intl !== 'undefined' &&
      typeof Intl.NumberFormat === 'function' &&
      typeof Intl.NumberFormat().formatToParts === 'function'
    )
  ) {
    console.log('Hola');
    const { default: intlFormatToPartsPolyfill } = await import(
      './intlFormatToPartsPolyfill'
    );
    intlFormatToPartsPolyfill();
  }

  // Add other polyfills here in similar fashion as above
};

export default loadPolyfills;
