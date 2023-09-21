import React from 'react';
import './Header.css';
import Language from './Language/Language';
import ReactGA from 'react-ga4';
import { AnalyticConfig } from '@configuration/analytic.config';
import { v4 as uuidv4 } from 'uuid';
import { type IHeaderProp } from '@interfaces/component/header/i.header-prop';
import { withTranslation } from 'react-i18next';
import NavBar from '@components/Header/NavBar/NavBar';

/**
 * Header app class
 * @module components
 * @extends React.Component<IHeaderProp, any>
 */
class Header extends React.Component<IHeaderProp, any> {
  /**
     * Constructor
     * @param {IHeaderProp} props
     */
  constructor(props: IHeaderProp) {
    super(props);
  }

  componentDidMount(): void {
    ReactGA.initialize(AnalyticConfig.googleTrackingId, {
      nonce: uuidv4()
    });
  }

  render(): React.JSX.Element {
    const { navItems } = this.props;
    return (
        <header className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <div className="header-logo">
                <a href="#">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9"
                         alt="Logo"/>
                </a>
            </div>
            <div className="header-language">
                <Language />
            </div>
            <nav className="header-navbar">
                <NavBar navItems={navItems} />
            </nav>
        </header>
    )
  }
}

export default withTranslation()(Header);
