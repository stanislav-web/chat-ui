import React from 'react';
import './VideoControlRemote.css';
import { type IVideoControlLocalState } from '@interfaces/component/video-control-local/i.video-control-local-state';
import { type IVideoControlRemoteProp } from '@interfaces/component/video-control-remote/i.video-control-remote-prop';
import { withTranslation } from 'react-i18next';

class VideoControlRemote extends React.Component<IVideoControlRemoteProp, IVideoControlLocalState> {
  /**
     * Constructor
     * @param {IVideoControlRemoteProp} props
     */
  constructor(props: IVideoControlRemoteProp) {
    super(props);
    this.state = {
      callBtn: null,
      recallBtn: null,
      breakBtn: null
    };
  }

  /**
     * On component render
     * @return void
     */
  componentDidMount(): void {

  }

  render(): React.JSX.Element {
    return (
        <div className="peer-control-remote">
        </div>
    )
  }
}

export default withTranslation(['VideoControlRemote', 'Errors', 'Exceptions'])(VideoControlRemote);
