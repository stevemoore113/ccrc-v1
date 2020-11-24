const uuid = require('uuid');

const _BASIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const _COMPLEX_CHARS = `${_BASIC_CHARS}!@#$%&*.+-;`;
const _NUMS = '0123456789';
const _SALT_ROUNDS = 9;

/**
 * @description To generate a random string via given length and base content
 * @private
 * @function
 * @param {number} len [len=1] - The length of random string
 * @param {string} chars [chars=BASIC_CHARS] - The base content of random string
 * @returns {string} Random value
 */
function _generateRandomValues(len = 1, chars = _BASIC_CHARS) {
  const buf = [];
  for (let i = 0; i < len; i++) {
    buf.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return buf.join('');
}

/**
 * @class
 * @classdesc Describe custom utils
 */
class CustomUtils {
  /**
   * @static
   * @description Sleep in seconds
   * @param {number} inSeconds
   * @returns {Promise.<void>} Promise.<void>
   */
  static sleep(inSeconds) {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, inSeconds * 1000);
    });
  }

  /**
   * @description Convert string to base64
   * @static
   * @param {string} str [str=''] String which needs to be converted
   * @returns {string} base64 string
   * @memberof CustomUtils
   */
  static fromStringToBase64(str = '') {
    return Buffer.from(str).toString('base64');
  }

  /**
   * @description Convert base64 string to ascii string
   * @static
   * @param {string} str [str=''] String which needs to be converted
   * @returns {string} ascii string
   *  @memberof CustomUtils
   */
  static fromBase64ToString(str = '') {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  /**
   * @description Generate numeric string with input length
   * @static
   * @param {number} len [len=9] The length of random string
   * @returns {string} Random value in numeric
   */
  static generateRandomNumbers(len = _SALT_ROUNDS) {
    return _generateRandomValues(len, _NUMS);
  }

  /**
   * @description Generate random string with input length
   * @static
   * @param {number} len [len=9] The length of random string
   * @returns {string} Random value
   */
  static generateRandomString(len = _SALT_ROUNDS) {
    return _generateRandomValues(len, _BASIC_CHARS);
  }

  /**
   * @description Generate random string with symbols with input length
   * @static
   * @param {number} len [len=9] The length of random string
   * @returns {string} Random value with symbols
   */
  static generateComplexRandomString(len = _SALT_ROUNDS) {
    return _generateRandomValues(len, _COMPLEX_CHARS);
  }

  /**
   * @description Generate a random string based on uuid
   * @async
   * @static
   * @returns {string} Random string based on uuid
   * @memberof CustomUtils
   */
  static async generateUUIDV4() {
    return uuid.v4();
  }
}

module.exports = CustomUtils;
