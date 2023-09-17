import { Button, Modal, type ModalProps } from 'flowbite-react';
import React from 'react';
import './Agreement.css';
import { getItem, setItem } from '@functions/localstorage.function';
import { type IAgreementState } from '@interfaces/agreement/i.agreement-state';
import { type IAgreement } from '@interfaces/agreement/i.agreement';
import { AppConfig } from '@configuration/app.config';

class Agreement extends React.Component<ModalProps | any, IAgreementState> implements IAgreement {
  private readonly location: Location = window.location;

  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: ModalProps | any) {
    super(props);
    this.state = {
      setOpenModal: 'default' as string | undefined,
      openModal: 'default' as string | undefined
    };
  }

  componentDidMount(): void {
    const isUserAgree = getItem('isUserAgree');
    this.setState(() => ({
      setOpenModal: Boolean(isUserAgree) ? undefined : 'default',
      openModal: Boolean(isUserAgree) ? undefined : 'default'
    }));
  }

  /**
     * Decline agreement
     */
  onDecline = (): void => {
    setItem('isUserAgree', false);
    this.setState(() => ({
      setOpenModal: 'default',
      openModal: 'default'
    }));
  };

  /**
     * Accept agreement
     */
  onAccept = (): void => {
    setItem('isUserAgree', true);
    this.props.onAgreementChange(true);
    this.setState(() => ({
      setOpenModal: undefined,
      openModal: undefined
    }));
  };

  render(): React.JSX.Element {
    const isModal = this.location.pathname !== AppConfig.routes.agreement;
    let Header;
    let Footer;

    if (isModal) {
      Header = <Modal show={this.state.openModal === 'default'} onClose={() => { this.onDecline(); }}>
              <Modal.Header>Terms of Service</Modal.Header>
              <Modal.Body>;
          Footer = </Modal.Body>
              <Modal.Footer>
                  <Button onClick={() => { this.onAccept(); }}>I accept</Button>
                  <Button color="gray" onClick={() => { this.onDecline(); }}>
                      Decline
                  </Button>
              </Modal.Footer>
          </Modal>;
    } else {
      Header = <h3>Agreement</h3>;
      Footer = '';
    }

    return <>
        {Header}
            <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
            </div>
        {Footer}
        </>
  }
}
export default Agreement;
