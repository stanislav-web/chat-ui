import { type AxiosRequestConfig, type ResponseType } from 'axios';
export const HttpConfig: AxiosRequestConfig & { responseType: ResponseType; headers: {
  'X-Http-Key': string;
  'X-Requested-With': string;
}; } = {
  baseURL: process.env.REACT_APP_HTTP_SERVER_URL,
  withCredentials: true,
  maxRedirects: 0,
  timeout: 1000,
  responseType: 'json',
  validateStatus: (status: number) => status >= 200 && status < 400,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Http-Key': process.env.REACT_APP_HTTP_KEY as string
  }
}
