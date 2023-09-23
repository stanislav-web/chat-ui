import React from 'react';
import './NavBar.css';
import { NavLink } from 'react-router-dom';
import { type INavbar } from '@interfaces/component/navbar/i.navbar';
import { type INavbarProp } from '@interfaces/component/navbar/i.navbar.prop';
import { withTranslation } from 'react-i18next';

/**
 * NavBar app class
 * @module components
 * @extends React.Component<INavbarProp, any>
 * @implements INavbar
 */
class NavBar extends React.Component<INavbarProp, any> implements INavbar {
  /**
     * Constructor
     * @param {INavbarProp} props
     */
  constructor(props: INavbarProp) {
    super(props);
  }

  render(): React.JSX.Element {
    const { navItems } = this.props;
    return (
        <ul className="footer-nav-links flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
          {Object.values(navItems).map(({ href, title }, index) =>
              <li className="m-2" key={index}>
                <NavLink to={href} key={index}>
                  <p key={index} className={'text-black'}>{title}</p>
                </NavLink>
              </li>
          )}
        </ul>
    )
  }
}

export default withTranslation()(NavBar);
