import axios from 'axios';
import { HttpConfig } from '../Components/Init/configuration/http.config';
import { NotificationService } from '../Services/notification.service';

axios.defaults.baseURL = process.env.REACT_APP_HTTP_SERVER_URL;
axios.defaults.withCredentials = HttpConfig.useCredentials;
axios.defaults.responseType = HttpConfig.responseType;
axios.defaults.timeout = HttpConfig.timeout;
axios.defaults.validateStatus = (status) => status >= 200 && status < 400;
axios.interceptors.request.use(function (config) {
  config.headers['X-Http-Key'] = HttpConfig.key;
  return config;
});
axios.interceptors.response.use(null, (error) => {
  if (!Object.prototype.hasOwnProperty.call(error, 'response')) {
    NotificationService.notifyError(error.name, error.message, 3000);
    return Promise.reject(error);
  } if (error.response.status >= 400) {
    NotificationService.notifyError('Error', error.response.data.message, 3000);
    return Promise.reject(error);
  }
});

export default axios;
