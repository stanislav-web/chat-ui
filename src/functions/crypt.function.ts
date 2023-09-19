import { AppConfig } from '@configuration/app.config';
import CryptoJS from 'crypto-js';

/**
 * Encrypt message
 * @param {string} message
x * @return string
 */
export const encryptMessage = (message: string): string => AppConfig.isDecrypt
  ? CryptoJS.AES.encrypt(message, AppConfig.key).toString()
  : message;

/**
 * Decrypt message
 * @param {string} encrypted
 * @return string
 */
export const decryptMessage = (encrypted: string): string => AppConfig.isDecrypt
  ? CryptoJS.AES.decrypt(encrypted, AppConfig.key).toString(CryptoJS.enc.Utf8)
  : encrypted;
