import crypto from 'crypto';

const ENC = 'bf3b2470cb9c07b1e0c1917c179477d9';
const IV = '526ec981636ec7e4';
const ALGO = 'aes-256-cbc';

export const encrypt = (text: string, key: number = 1) => {
  let cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const decrypt = (text: string, key: number = 1) => {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
