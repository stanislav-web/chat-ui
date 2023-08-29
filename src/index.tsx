import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Init, Header, FooterWithSocialMediaIcons, Agreement } from './Components/index';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import './Utils/i18.util';
import './Utils/axios.util';

const root = createRoot(document.getElementById('root') as HTMLElement);

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
            <Agreement />
            <Header />
            <Index />
            <FooterWithSocialMediaIcons />
        </ErrorBoundary>
    </CookiesProvider>
);
