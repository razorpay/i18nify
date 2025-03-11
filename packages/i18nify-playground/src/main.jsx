import { I18nProvider } from '@razorpay/i18nify-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { BladeProvider } from '@razorpay/blade/components';
import '@razorpay/blade/fonts.css';
import { bladeTheme } from '@razorpay/blade/tokens';
import React from 'react';
import { LanguagesProvider } from 'src/context/languagesContext';
import App from './App';

import { IntlOptionsProvider } from './context/intlOptionsContext';
import ErrorBoundary from 'src/components/Dashboard/ErrorBoundry';
// @razorpay/i18nify-js 1.12.3 @razorpay/i18nify-react
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient({});

root.render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <IntlOptionsProvider>
          <LanguagesProvider>
            <HelmetProvider>
              <BrowserRouter>
                <Suspense>
                  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
                    <App />
                  </BladeProvider>
                </Suspense>
              </BrowserRouter>
            </HelmetProvider>
          </LanguagesProvider>
        </IntlOptionsProvider>
      </I18nProvider>
    </QueryClientProvider>
  </ErrorBoundary>,
);
