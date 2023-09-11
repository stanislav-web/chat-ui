import React from 'react';
import './VideoChat.css';
import { type IVideoChatProp } from '@interfaces/peer/i.video-chat-prop';

class VideoChat extends React.Component<IVideoChatProp, any> {
  /**
     * Constructor
     * @param {IVideoChatProp} props
     */
  constructor(props: IVideoChatProp) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  render(): React.JSX.Element {
    return (
        <div>
          {/* <select id="video-device" */}
          {/* eslint-disable-next-line max-len */}
          {/*   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> */}
          {/*   <option selected>Choose a country</option> */}
          {/*   <option value="US">United States</option> */}
          {/*   <option value="CA">Canada</option> */}
          {/*   <option value="FR">France</option> */}
          {/*   <option value="DE">Germany</option> */}
          {/* </select> */}
          {/* <select id="audio-device" */}
          {/*         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"> */}
          {/*   <option selected>Choose a country</option> */}
          {/*   <option value="US">United States</option> */}
          {/*   <option value="CA">Canada</option> */}
          {/*   <option value="FR">France</option> */}
          {/*   <option value="DE">Germany</option> */}
          {/* </select> */}
        </div>
    )
  }
}

export default VideoChat;
