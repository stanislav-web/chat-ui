import React from 'react';
import './Footer.css';
import { withTranslation } from 'react-i18next';
import { type IFooterProp } from '@interfaces/component/footer/i.footer-prop';
import NavBar from '@components/Footer/NavBar/NavBar';

/**
 * Footer app class
 * @module components
 * @extends React.Component<IFooterProp, any>
 */
class Footer extends React.Component<IFooterProp, any> {
  /**
     * Constructor
     * @param {IFooterProp} props
     */
  constructor(props: IFooterProp) {
    super(props);
  }

  render(): React.JSX.Element {
    const { navItems } = this.props;
    return (
        <footer className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <nav className="footer-navbar">
                <NavBar navItems={navItems} />
            </nav>
        </footer>
    )
  }
}

export default withTranslation()(Footer);
