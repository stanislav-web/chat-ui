import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import './index.css';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Init from './Components/Init/init';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import { CookiesProvider } from 'react-cookie';
import { NotificationService } from './services/notification.service';

const root = createRoot(document.getElementById('root') as HTMLElement);
axios.defaults.baseURL = process.env.REACT_APP_HTTP_SERVER_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  config.headers['X-Http-Key'] = process.env.REACT_APP_HTTP_KEY;
  return config;
});
axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status >= 400) {
    NotificationService.notifyError('Error', error.response.message, 3000);
    return Promise.reject(error);
  }
});

const Index = (): React.JSX.Element =>
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Init />} />
    </Routes>
  </BrowserRouter>
;

root.render(
    <CookiesProvider>
        <ErrorBoundary>
            <Index />
        </ErrorBoundary>
    </CookiesProvider>
);
