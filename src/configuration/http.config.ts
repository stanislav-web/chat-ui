import { type AxiosRequestConfig, type ResponseType } from 'axios';
import { type ExceptionStatusType, type FailedStatusType, type SuccessStatusType } from '@types/http-status.type';
export const HttpConfig: AxiosRequestConfig & { responseType: ResponseType; headers: {
  'X-Http-Key': string;
  'X-Requested-With': string;
}; } = {
  baseURL: process.env.REACT_APP_HTTP_SERVER_URL,
  withCredentials: true,
  maxRedirects: 0,
  timeout: 10000,
  responseType: 'json',
  validateStatus: (status: SuccessStatusType | FailedStatusType | ExceptionStatusType) => status >= 200 && status < 400,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Http-Key': process.env.REACT_APP_HTTP_KEY as string
  }
}
