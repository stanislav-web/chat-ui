import './index.css';
import adapter from 'webrtc-adapter';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalDebug } from '@functions/log.function';
import { checkAuth } from '@functions/window.function';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Init, Header, FooterWithSocialMediaIcons } from '@components/index';
import { CookiesProvider } from 'react-cookie';
import './utils';
import './events/screen.event.ts';
import NotFound from '@components/NotFound/NootFound';
import { AppConfig } from '@configuration/app.config';

adapter.disableWarnings(AppConfig.isProduction)
adapter.disableLog(AppConfig.isProduction)

AppConfig.isProduction && GlobalDebug(false);
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
