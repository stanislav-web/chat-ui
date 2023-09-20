import axios from 'axios';
import { HttpConfig } from '@configuration/http.config';
import { getItem } from '@functions/localstorage.function';
import { AppConfig } from '@configuration/app.config';

axios.defaults.baseURL = HttpConfig.baseURL;
axios.defaults.withCredentials = HttpConfig.withCredentials;
axios.defaults.responseType = HttpConfig.responseType;
axios.defaults.timeout = HttpConfig.timeout as number;
axios.defaults.maxRedirects = HttpConfig.maxRedirects;
axios.defaults.validateStatus = HttpConfig.validateStatus;
axios.interceptors.request.use((config) => {
  config.headers['X-Http-Key'] = HttpConfig.headers['X-Http-Key'];
  config.headers['X-Requested-With'] = HttpConfig.headers['X-Requested-With'];
  config.headers['X-Language'] = getItem('lang') ? AppConfig.defaultLanguage : '';
  return config;
});
export default axios;
