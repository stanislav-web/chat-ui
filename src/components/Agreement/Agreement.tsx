import React from 'react';
import './Agreement.css';
import { getItem, setItem } from '@functions/localstorage.function';
import { type IAgreementState } from '@interfaces/component/agreement/i.agreement-state';
import { type IAgreement } from '@interfaces/component/agreement/i.agreement';
import { AppConfig } from '@configuration/app.config';
import AgreementText from '@components/Agreement/AgreementText/AgreementText';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { type IAgreementProps } from '@interfaces/component/agreement/i.agreement-props';
import { withTranslation } from 'react-i18next';

/**
 * Agreement app class
 * @module components
 * @extends React.Component<IAgreementProps, IAgreementState>
 * @implements IAgreement
 */
class Agreement extends React.Component<IAgreementProps, IAgreementState> implements IAgreement {
  private readonly location: Location = window.location;

  /**
     * Constructor
     * @param {IAgreementProps} props
     */
  constructor(props: IAgreementProps) {
    super(props);
    this.state = {
      isHidden: true
    };
  }

  componentDidMount(): void {
    const isUserAgree = getItem('isUserAgree') === true;
    this.setState(() => ({
      isHidden: Boolean(isUserAgree)
    }));
  }

  /**
     * Decline agreement
     */
  onDecline(): void {
    this.setState(() => ({
      isHidden: false
    }));
  };

  /**
     * Accept agreement
     */
  onAccept(): void {
    setItem('isUserAgree', true);
    this.props.onAgreementChange(true);
    this.setState(() => ({
      isHidden: true
    }));
  };

  render(): React.JSX.Element {
    const isModal = this.location.pathname !== AppConfig.routes.agreement.href;
    let Content: React.ReactNode,
      Header: React.ReactNode,
      Footer: React.ReactNode;

    if (isModal) {
      Header =
          <div className="mofdal-header">
            <span icon="pi pi-id-card">Agreement</span>
          </div>;
      Footer =
          <div className="modal-footer">
            <Button label="No" icon="pi pi-times" onClick={() => { this.onDecline(); }} className="p-button-text" />
            <Button label="I accept" icon="pi pi-check" onClick={() => { this.onAccept(); }} autoFocus />
          </div>;
      Content =
          <Dialog
              header={Header}
              closable={false}
              closeOnEscape={false}
              draggable={false}
              modal={true}
              visible={!this.state.isHidden}
              style={{ width: '50vw' }}
              onHide={() => { this.onDecline(); }}
              footer={Footer}>
            <AgreementText />
          </Dialog>
    } else {
      Content = <>
            <h3>Agreement</h3>
            <AgreementText />
        </>;
    }

    return <>
        {Content}
        </>
  }
}
export default withTranslation()(Agreement);
