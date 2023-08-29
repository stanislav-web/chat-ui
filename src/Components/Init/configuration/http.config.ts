import { type ResponseType } from 'axios';
export const HttpConfig = {
  useCredentials: true,
  timeout: 1000 as number,
  responseType: 'json' as ResponseType,
  key: process.env.REACT_APP_HTTP_KEY as string
}
