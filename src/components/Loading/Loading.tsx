import React from 'react';
import { withTranslation } from 'react-i18next';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { MediaConfig } from '@configuration/media.config';
import { type ILoadingProp } from '@interfaces/component/loading/i.loading-prop';

/**
 * Loading app class
 * @module components
 * @extends React.Component<ILoadingProp, any>
 */
class Loading extends React.Component<ILoadingProp, any> {
  /**
   * @type string [poster]
   * @private
   */
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
     * Constructor
     * @param {ILoadingProp} props
     */
  constructor(props: ILoadingProp) {
    super(props);
  }

  render(): React.JSX.Element {
    return (
        <div className="peer-container">
              <div className="peer-output">
                  <Splitter className="mb-5">
                    <SplitterPanel className="flex align-items-center justify-content-center">
                      <div className="video-remote">
                        <div className="video-remote-container">
                          <video disablePictureInPicture autoPlay playsInline poster={this.poster}/>
                        </div>
                      </div>
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center">
                      <div className="video-local">
                        <div className="video-local-container">
                          <video autoPlay playsInline muted poster={this.poster} />
                        </div>
                      </div>
                    </SplitterPanel>
                  </Splitter>
                </div>
        </div>
    )
  }
}

export default withTranslation()(Loading);
