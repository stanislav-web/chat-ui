import { Button, Modal, type ModalProps } from 'flowbite-react';
import React from 'react';
import './Agreement.css';
import { getItem, setItem } from '@functions/localstorage.function';
import { type IAgreementState } from '@interfaces/agreement/i.agreement-state';
import { type IAgreement } from '@interfaces/agreement/i.agreement';
import { AppConfig } from '@configuration/app.config';
import AgreementText from '@components/Agreement/AgreementText/AgreementText';
import { withTranslation } from 'react-i18next';

class Agreement extends React.Component<ModalProps | any, IAgreementState> implements IAgreement {
  private readonly location: Location = window.location;

  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: ModalProps | any) {
    super(props);
    this.state = {
      setOpenModal: 'default' | undefined,
      openModal: 'default' | undefined
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
    let Content;

    if (isModal) {
      Content =
          <Modal show={this.state.openModal === 'default'} onClose={() => { this.onDecline(); }}>
              <Modal.Header>Agreement</Modal.Header>
              <Modal.Body>
                <AgreementText />
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={() => { this.onAccept(); }}>I accept</Button>
                  <Button color="gray" onClick={() => { this.onDecline(); }}>
                      Decline
                  </Button>
              </Modal.Footer>
          </Modal>;
    } else {
      Content = <div>
            <h3>Agreement</h3>
            <AgreementText />
        </div>;
    }

    return <>
        {Content}
        </>
  }
}
export default withTranslation()(Agreement);
