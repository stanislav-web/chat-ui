import Swal from 'sweetalert2';
import axios from 'axios';
import React from 'react';
import { DeviceService } from './services/device.service';

class Init extends React.Component<any, any> {
  constructor(props: any) {
    // Required step: always call the parent class' constructor
    super(props);
    this.state = {
      isCookieEnabled: navigator.cookieEnabled
    };
  }

  /**
   * Is Cookies enabled
   */
  isCookieEnabled(): boolean {
    return navigator.cookieEnabled;
  }

  async componentDidMount(): Promise<void> {
    const deviceService = new DeviceService();
    const userDevice = await deviceService.getUserDevice();
    try {
      await axios.post('/auth/me', userDevice);
    } catch (e) {
      await Swal.fire({
        icon: 'success',
        title: 'Project saved successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  render(): React.JSX.Element {
    return <div />;
  }
}

export default Init;
