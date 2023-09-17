import React from 'react';
import './VideoControlLocal.css';
import { type IVideoControlLocalProp } from '@interfaces/component/video-control-local/i.video-control-local-prop';
import { type IVideoControlLocal } from '@interfaces/component/video-control-local/i.video-control-local';
import { MediaConfig } from '@configuration/media.config';
import { type IVideoControlLocalState } from '@interfaces/component/video-control-local/i.video-control-local-state';
import SelectLocalDevice from '@components/VideoLocal/VideoControlLocal/SelectLocalDevice/SelectLocalDevice';
import { withTranslation } from 'react-i18next';

/**
 * VideoControlLocal app class
 * @module components
 * @extends React.Component<IVideoControlLocalProp, IVideoControlLocalState>
 * @implements IVideoControlLocal
 */
class VideoControlLocal extends React.Component<IVideoControlLocalProp, IVideoControlLocalState> implements IVideoControlLocal {
  /**
     * @type UniqueId callBtnId
     * @private
     */
  private readonly callBtnId: string = MediaConfig.control.callBtnId;

  /**
     * @type UniqueId recallBtnId
     * @private
     */
  private readonly recallBtnId: string = MediaConfig.control.recallBtnId;

  /**
     * @type UniqueId breakBtnId
     * @private
     */
  private readonly breakBtnId: string = MediaConfig.control.breakBtnId;

  /**
     * Constructor
     * @param {IVideoControlLocalProp} props
     */
  constructor(props: IVideoControlLocalProp) {
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
    const state = {
      callBtn: document.getElementById(this.callBtnId),
      recallBtn: document.getElementById(this.recallBtnId),
      breakBtn: document.getElementById(this.breakBtnId)
    };
    state.callBtn.removeAttribute('disabled');
    state.breakBtn.setAttribute('disabled', 'disabled');
    state.recallBtn.setAttribute('disabled', 'disabled');
    this.setState(state);
  }

  /**
     * On Call handler
     * @return void
     */
  onCall = (): void => {
    console.log('PROPS', this.props);
    console.log('STATE', this.state);
    // this.state.callBtn.setAttribute('disabled', 'disabled');
  }

  /**
     * On ReCall handler
     * @return void
     */
  onReCall = (): void => {
    this.state.recallBtn.setAttribute('disabled', 'disabled');
  }

  /**
     * On Break handler
     * @return void
     */
  onBreak = (): void => {
    this.state.breakBtn.setAttribute('disabled', 'disabled');
  }

  render(): React.JSX.Element {
    const { stream, peer, video } = this.props;
    return (
        <div className="video-local-control">
            <SelectLocalDevice stream={stream} peer={peer} video={video} />
            <button
                    id={this.callBtnId}
                    onClick={() => { this.onCall(); }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                <span>Start</span>
            </button>

            <button
                id={this.breakBtnId}
                onClick={(event) => { this.onBreak(event); }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                <span>Stop</span>
            </button>

            <button
                id={this.recallBtnId}
                onClick={(event) => { this.onReCall(event); }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                <span>Restart</span>
            </button>
        </div>
    )
  }
}

export default withTranslation(['Base', 'Exceptions'])(VideoControlLocal);
