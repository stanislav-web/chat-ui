import React from 'react';
import './NavBar.css';
import { NavLink } from 'react-router-dom';
import { type INavbar } from '@interfaces/component/navbar/i.navbar';
import { type INavbarProp } from '@interfaces/component/navbar/i.navbar.prop';
import { logout } from '@functions/auth.function';
import { notifyError } from '@functions/notification.function';
import { withTranslation } from 'react-i18next';
import { redirectPage } from '@functions/window.function';

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

  /**
     * On logout
     * @return void
     */
  onLogout = async (): void => {
    try {
      await logout('/auth/logout');
      redirectPage();
    } catch (error: Error) {
      notifyError(error.name, error.message);
    }
  }

  render(): React.JSX.Element {
    const { navItems } = this.props;
    return (
        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            {Object.values(navItems).map(({ href, title }, index) =>
                <li className="m-2" key={index}>
                    <NavLink to={href} key={index}>
                        <p key={index} className={'text-black'}>{title}</p>
                    </NavLink>
                </li>
            )}
            <li className="m-2" key="logout">
                <NavLink to="#" onClick={(event) => { this.onLogout(event); }}>
                    <p className={'text-black'}>Logout</p>
                </NavLink>
            </li>
        </ul>
    )
  }
}

export default withTranslation()(NavBar);
