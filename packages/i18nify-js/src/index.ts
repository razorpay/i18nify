import loadPolyfills from './modules/.internal/polyfills/index';

// Call the loadPolyfills function
loadPolyfills()
  .catch((error: any) => {
    // Handle any errors that occurred while loading polyfills
    console.error('Error loading i18nify polyfills:', error);
  });

export * from './modules/core';
export * from './modules/currency';
export * from './modules/phoneNumber';
