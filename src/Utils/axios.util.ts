import axios from 'axios';
import { HttpConfig } from '../Configuration/http.config';
import { getItem } from '../Functions/localstorage.function';
import { AppConfig } from '../Configuration/app.config';

axios.defaults.baseURL = HttpConfig.baseURL;
axios.defaults.withCredentials = HttpConfig.withCredentials;
axios.defaults.responseType = HttpConfig.responseType;
axios.defaults.timeout = HttpConfig.timeout;
axios.defaults.maxRedirects = HttpConfig.maxRedirects;
axios.defaults.validateStatus = HttpConfig.validateStatus;
axios.interceptors.request.use(function (config) {
  config.headers['X-Http-Key'] = HttpConfig.headers['X-Http-Key'];
  config.headers['X-Requested-With'] = HttpConfig.headers['X-Requested-With'];
  config.headers['X-Language'] = getItem('lang') || AppConfig.defaultLanguage;
  return config;
});

export default axios;
