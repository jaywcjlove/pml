import crypto from 'crypto-js';

/** 解密 */
export function decrypt(encrypted: string = '') {
  const [text, keyS, ivS] = encrypted.split('.');
  const keyStr = crypto.enc.Base64.parse(keyS);
  const decrypted = crypto.AES.decrypt(text, keyStr, {
    iv: crypto.enc.Base64.parse(ivS),
  });
  return decrypted.toString(crypto.enc.Utf8);
}
