import crypto from 'crypto';

const ALGO = 'aes-256-cbc';

/** 加密 */
export const encrypt = (plaintext: string) => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted + '.' + key.toString('base64') + '.' + iv.toString('base64');
};

/** 解密 */
export const decrypt = (encrypted: string = '') => {
  const [text, keyS, ivS] = encrypted.split('.');
  const keyStr = Buffer.from(keyS, 'base64');
  const ivStr = Buffer.from(ivS, 'base64');
  const decipher = crypto.createDecipheriv(ALGO, keyStr, ivStr);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
