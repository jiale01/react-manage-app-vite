import CryptoJS from 'crypto-js';

const AES_KEY = 'my_super_secret_key_1234567890AB'; // 32位
const AES_IV = 'your-iv-16-char!'; // 16位

/**
 * AES 加密 - 与后端 Node.js crypto 模块兼容
 * @param {string} text - 需要加密的明文
 * @returns {string} - Base64 编码的密文（不含盐值）
 */
export const encrypt = (text: string) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(AES_IV);

    // 加密
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('AES 加密失败:', error);
    throw new Error('密码加密失败');
  }
};

/**
 * AES 解密 - 与后端 Node.js crypto 模块兼容
 * @param {string} encryptedText - Base64 编码的密文（不含盐值）
 * @returns {string} - 解密后的明文
 */
export const decrypt = (encryptedText: string) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(AES_IV);

    // 将 Base64 密文转为 CipherParams 对象
    const encryptedHex = CryptoJS.enc.Base64.parse(encryptedText);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedHex
    });

    // 解密
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('AES 解密失败:', error);
    throw new Error('密码解密失败');
  }
};
