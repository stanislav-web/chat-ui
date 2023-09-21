import React from 'react';
import './AgreementText.css';
import { withTranslation } from 'react-i18next';

/**
 * AgreementText app class
 * @module components
 * @extends React.Component<any, any>
 * @implements IInit
 */
class AgreementText extends React.Component<any, any> {
  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: any) {
    super(props);
  }

  render(): React.JSX.Element {
    return (
            <div className="space-y-6">
                <p className="mb-5">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
                <p className="mb-5">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                </p>
            </div>);
  }
}
export default withTranslation()(AgreementText);
