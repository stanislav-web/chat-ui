import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import './index.css';
import axios from 'axios';
// eslint-disable-next-line import/named
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Init from './components/Init/init';

const root = createRoot(document.getElementById('root') as HTMLElement);
axios.defaults.baseURL = process.env.REACT_APP_HTTP_SERVER_URL;

axios.interceptors.request.use(function (config) {
  config.headers['X-Http-Key'] = process.env.REACT_APP_HTTP_KEY;
  return config;
});

const Index = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Init />} />
    </Routes>
  </BrowserRouter>
);

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
