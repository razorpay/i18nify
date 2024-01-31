import loadPolyfills from './modules/.internal/polyfills/index';

// Call the loadPolyfills function
loadPolyfills()
  .then(() => {
    // Polyfills loaded successfully
    console.info('i18nify polyfills loaded successfully !');
  })
  .catch((error: any) => {
    // Handle any errors that occurred while loading polyfills
    console.error('Error loading i18nify polyfills:', error);
  });

export * from './modules/core';
export * from './modules/currency';
export * from './modules/phoneNumber';
