import loadPolyfills from './modules/.internal/polyfills/index';

// Call the loadPolyfills function
loadPolyfills()
  .then(() => {
    // Polyfills loaded successfully
    console.info('Polyfills loaded successfully!');
  })
  .catch((error) => {
    // Handle any errors that occurred while loading polyfills
    console.error('Error loading polyfills:', error);
  });

export * from './modules/core';
export * from './modules/currency';
export * from './modules/phoneNumber';
