import { I18nProvider } from '@razorpay/i18nify-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

import { BladeProvider } from '@razorpay/blade/components';
import '@razorpay/blade/fonts.css';
import { bladeTheme } from '@razorpay/blade/tokens';
import React from 'react';
import { LanguagesProvider } from 'src/context/languagesContext';
import App from './app';

import ErrorBoundary from 'src/components/Dashboard/ErrorBoundry';
import { IntlOptionsProvider } from './context/intlOptionsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient({});

root.render(
  <HashRouter>
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <IntlOptionsProvider>
              <LanguagesProvider>
                <HelmetProvider>
                  <Suspense fallback={<div>Loading</div>}>
                    <App />
                  </Suspense>
                </HelmetProvider>
              </LanguagesProvider>
            </IntlOptionsProvider>
          </I18nProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </BladeProvider>
  </HashRouter>,
);
