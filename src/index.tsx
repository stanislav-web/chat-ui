import './index.css';
import adapter from 'webrtc-adapter';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalDebug } from '@functions/log.function';
import { checkAuth } from '@functions/window.function';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './events/screen.event.ts';
import NotFound from '@components/NotFound/NootFound';
import { AppConfig } from '@configuration/app.config';
import Agreement from '@components/Agreement/Agreement';
import About from '@components/About/About';
import Payments from '@components/Payments/Payments';
import Rules from '@components/Rules/Rules';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import Header from '@components/Header/Header';
import FooterWithSocialMediaIcons from '@components/Footer/Footer';
import Init from '@components/Init/Init';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './utils';
import HeaderNav from '@components/Header/HeaderNav/HeaderNav';

adapter.disableWarnings(AppConfig.isProduction)
adapter.disableLog(AppConfig.isProduction)

AppConfig.isProduction && GlobalDebug(false);
checkAuth();

const root = createRoot(document.getElementById('root') as HTMLElement);
const {
  index, about, agreement,
  rules, payments, notFound
} = AppConfig.routes;

const Index = (): React.JSX.Element =>
   <BrowserRouter>
    <HeaderNav navItems={AppConfig.routes}/>
    <Routes>
        <Route path={index.href} element={<Init />} />
        <Route path={about.href} element={<About />} />
        <Route path={agreement.href} element={<Agreement />} />
        <Route path={rules.href} element={<Rules />} />
        <Route path={payments.href} element={<Payments />} />
        <Route path={notFound} element={<NotFound />} />
    </Routes>
  </BrowserRouter>
;

root.render(
    <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
            <Header navItems={AppConfig.routes} />
            <Index />
            <FooterWithSocialMediaIcons navItems={AppConfig.routes}/>
        </ErrorBoundary>
    </I18nextProvider>
);
