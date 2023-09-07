import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { checkAuth } from '@functions/window.function';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Init, Header, FooterWithSocialMediaIcons } from '@components/index';
import { CookiesProvider } from 'react-cookie';
import './utils';
import NotFound from '@components/NotFound/NootFound';

checkAuth();

const root = createRoot(document.getElementById('root') as HTMLElement);

const Index = (): React.JSX.Element =>
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Init />} />
        <Route path="*" element={<NotFound />} />
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
