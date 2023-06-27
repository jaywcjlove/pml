import { createRoot } from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { RouterProvider, createHashRouter, RouteObject } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster, DefaultToastOptions } from 'react-hot-toast';
import '@wcj/dark-mode';
import { Fallback } from './comps/Fallback';
import { routes } from './router';
import { AuthProvider } from './store';
import { queryClient } from './utils/react-query';

export const GlobalStyle = createGlobalStyle`
  [data-color-mode*='dark'], [data-color-mode*='dark'] body {
    --color-message-fg: #62d79540;
  }
  [data-color-mode*='light'], [data-color-mode*='light'] body {
    --color-message-fg: #00c2542e;
  }
  body {
    margin: 0;
    font-size: 14px;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }
  * {
    box-sizing: border-box;
  }
  :root {
    --color-init: 255 255 255;
    --color-initial: 0 0 0;
    --color-initial-op: 255 255 255;
    --color-neutral-muted: rgba(175, 184, 193, 0.2);
    --success-color: #09C62C;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --remind-color: #F95C2B;
    --primary-color: #1e88e5;
    --primary-color-hover: #1976d2;
    --secondary-color: #26a69a;
    --secondary-color-hover: #00897b;
    --background-color: #ffffff;
    --text-color: #212121;
    --text-color-light: #757575;
    --border-color: #e0e0e0;
    --header-color: #f5f5f5;
    --header-text-color: #424242;
    --button-color: #1e88e5;
    --button-text-color: #ffffff;
  }

  [data-color-mode*='dark'] {
    --color-init: 56 62 71;
    --color-initial: 255 255 255;
    --color-initial-op: 0 0 0;
    --color-neutral-muted: rgba(110, 118, 129, 0.4);
    --success-color: #09C62C;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --remind-color: #F95C2B;
    --primary-color: #2196f3;
    --primary-color-hover: #1e88e5;
    --secondary-color: #4db6ac;
    --secondary-color-hover: #26a69a;
    --background-color: #303030;
    --text-color: #ffffff;
    --text-color-light: #9e9e9e;
    --border-color: #424242;
    --header-color: #424242;
    --header-text-color: #ffffff;
    --button-color: #2196f3;
    --button-text-color: #ffffff;
  }
`;

const root = createRoot(document.getElementById('root')!);

const toastOptions: DefaultToastOptions = {
  style: { backgroundColor: 'rgba(var(--color-init) / 0.95)', color: 'var(--color-theme-text)' },
};

root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <dark-mode permanent style={{ zIndex: 999, right: 10, top: 10, position: 'fixed' }}></dark-mode>
      <GlobalStyle />
      <RouterProvider router={createHashRouter(routes as RouteObject[])} fallbackElement={<Fallback />} />
      <Toaster position="top-right" toastOptions={toastOptions} />
    </AuthProvider>
  </QueryClientProvider>,
);
