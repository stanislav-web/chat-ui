import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import './Functions/window.function';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Init, Header, FooterWithSocialMediaIcons } from './Components/index';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import './Utils';

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
            <Header />
            <Index />
            <FooterWithSocialMediaIcons />
        </ErrorBoundary>
    </CookiesProvider>
);
