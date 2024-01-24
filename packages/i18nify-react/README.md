# i18nify-react

Welcome to i18nify-react, your new best friend for seamlessly managing i18n state in React applications! 🎉 The i18nify-react Context Provider is a simple and flexible solution for managing internationalization (i18n) state in React applications. This provider utilizes the @razorpay/i18nify-js library to handle i18n state and exposes a React Context for efficient state management across the application.

## Features

- **I18nProvider:** A custom React Context provider that effortlessly spreads i18n state updates across your component tree.
- **useI18nContext Hook:** Fetch values exposed by the `I18nProvider` using this handy custom React hook.
- **Easy Integration:** Integrate i18n state management into your React app with style and ease.
- **Consistent State:** Ensure a single instance of `I18nProvider` at the topmost parent component for consistent i18n state handling.

## Installation

1. Install the `@razorpay/i18nify-js` package:

   ```bash
   npm install @razorpay/i18nify-js
   ```

2. Install the `@razorpay/i18nify-react` package:

   ```bash
   npm install @razorpay/i18nify-react
   ```

3. Import the `I18nProvider` and `useI18nContext` components into your project:

   ```javascript
   import { I18nProvider, useI18nContext } from '@razorpay/i18nify-react';
   ```

## Usage

### I18nProvider

Add the `I18nProvider` to the topmost parent component in your application to kickstart the i18n magic! 🪄

#### Example:

```jsx
import React from 'react';
import { I18nProvider } from '@razorpay/i18nify-react';

const App = ({ data }) => {
  return (
    <I18nProvider initData={data}>
      <div>
        <h1>Server-Side Rendering</h1>
        {/* Your components go here */}
      </div>
    </I18nProvider>
  );
};

export default App;
```

### useI18nContext Hook

Leverage the `useI18nContext` hook to fetch values exposed by the `I18nProvider` deep down in your component tree. 🌳

#### Example:

```jsx
import React from 'react';
import { useI18nContext } from '@razorpay/i18nify-react';

const MyComponent = () => {
  const { i18nState, setI18nState } = useI18nContext();

  // Access and update i18n state as needed

  return <div>{/* Your component content */}</div>;
};

export default MyComponent;
```

## API Reference

### I18nProvider Props

- **children (required):** The components wrapped by the `I18nProvider`.
- **initData (optional):** Initial data to merge with the i18n state during initialization.

### useI18nContext Hook

- **Returns:** An object with properties `i18nState` and `setI18nState` for accessing and updating the i18n state.

Happy coding! 🚀🌈
