const _validator = require('validator').default;
const _deepEqual = require('deep-equal');
const CustomError = require('../custom-models/custom-error');

const _namesEnum = {
  NON_EMPTY_STRING: 'isNonEmptyString',
  NON_EMPTY_ARRAY: 'isNonEmptyArray',
  IS_EMAIL: 'isEmail',
  IS_BOOL: 'isBoolean',
  IS_DATE: 'isDate',
  IS_BEFORE: 'isBefore',
  IS_NUM: 'isNumber',
};

/**
 * @private
 * @function
 * @description Validate if input string is empty
 * @param {string} val
 * @returns {boolean} boolean
 */
function _nonEmptyString(val) {
  if (!val || typeof val !== 'string') {
    return false;
  }
  return !_validator.isEmpty(val);
}

/**
 * @private
 * @function
 * @description Validate is input array is empty
 * @param {Object[]} val
 * @returns {boolean} boolean
 */
function _nonEmptyArray(val) {
  return val
    && Array.isArray(val)
    && val.length > 0;
}
/**
 * @private
 * @function
 * @description Validate input value to be number
 * @param {object} num
 * @returns {boolean} boolean
 */
function _isNumber(num) {
  return typeof num === 'number';
}

const _strategies = new Map()
  .set(_namesEnum.NON_EMPTY_STRING, _nonEmptyString)
  .set(_namesEnum.NON_EMPTY_ARRAY, _nonEmptyArray)
  .set(_namesEnum.IS_EMAIL, _validator.isEmail)
  .set(_namesEnum.IS_BOOL, _validator.isBoolean)
  .set(_namesEnum.IS_DATE, _validator.toDate)
  .set(_namesEnum.IS_NUM, _isNumber)
  .set(_namesEnum.IS_BEFORE, _validator.isBefore);

/**
 * @class
 * @classdesc Describe custom validator
 */
class CustomValidator {
  /**
  * @static
  * @property {Object} strategies
  * @description Get strategy enum
  */
  static get strategies() {
    return _namesEnum;
  }

  /**
   * @static
   * @property {Object} strings
   * @description All string validators
   */
  static get strings() {
    return _validator;
  }

  /**
   * @description Check if input value is valid, accept multiple rules
   * @method
   * @param {any} val - Input value
   * @param {Object[]} rules - Defined rules
   * @param {string} rules[].s - Name of strategy for validating input value
   * @param {string} rules[].m - Error message when validate fail
   * @param {function} rules[].fn - Custom validate function, piority is higher than s
   * @returns {CustomValidator} CustomValidator
   * @throws {CustomError} Throws error if validating is not pass
   */
  checkThrows(val, ...rules) {
    for (const rule of rules) {
      if (rule.fn && typeof rule.fn === 'function') {
        const result = rule.fn(val);
        if (!result) {
          throw new CustomError(rule.m);
        }
        continue;
      }
      const s = _strategies.get(rule.s);
      if (!s) {
        throw new CustomError(null, `${rule.s} checker is not defined`);
      }
      const result = s(val);
      if (!result) {
        throw new CustomError(rule.m);
      }
    }
    return this;
  }

  /**
   * @description Check if input string being empty
   * @method
   * @param {string} val
   * @param {string} message
   * @returns {CustomValidator} CustomValidator
   * @throws {CustomError} Throws error if validating is not pass
   */
  nonEmptyStringThrows(val = '', message = '') {
    if (!_nonEmptyString(val)) {
      throw new CustomError(message);
    }
    return this;
  }

  /**
   * @description Check if input value is number
   * @method
   * @param {number} val
   * @param {string} message
   * @returns {CustomValidator} CustomValidator
   * @throws {CustomError} Throws error if validating is not pass
   */
  isNumberThrows(val = 0, message = '') {
    if (!_isNumber(val)) {
      throw new CustomError(message);
    }
    return this;
  }

  /**
   * @description Check if input value is valid, only accept one rule
   * @static
   * @param {any} val - Input value
   * @param {Object} rule - Defined rule
   * @param {string} rule.s - Name of strategy for validating input value
   * @param {string} rule.m - Error message when validate fail
   * @param {function} rule.fn - Custom validate function, piority is higher than s
   * @returns {boolean} boolean
   * @throws {CustomError} Throws error if strategy not found
   */
  static check(val, rule) {
    if (rule.fn && typeof rule.fn === 'function') {
      const result = rule.fn(val);
      if (!result && _nonEmptyString(rule.m)) {
        throw new CustomError(rule.m);
      }
      return result;
    }
    const s = _strategies.get(rule.s);
    if (!s) {
      throw new CustomError(null, `${rule.s} checker is not defined`);
    }
    const sResult = s(val);
    if (!sResult && _nonEmptyString(rule.m)) {
      throw new CustomError(rule.m);
    }
    return sResult;
  }

  /**
   * @description Validate if input string is not empty string
   * @static
   * @param {string} val - Input value
   * @param {string} [message=''] - Message while checking fail
   * @returns {boolean} boolean
   * @throws {CustomError} Throws error when message is not empty
   */
  static nonEmptyString(val, message = '') {
    const result = _nonEmptyString(val);
    if (!result && _nonEmptyString(message)) {
      throw new CustomError(message);
    }
    return result;
  }

  /**
   * @description Validate if input value is not empty array
   * @static
   * @param {Object[]} val - Input value
   * @param {string} [message=''] - Message while checking fail
   * @returns {boolean} boolean
   * @throws {CustomError} Throws error when message is not empty
   */
  static nonEmptyArray(val, message) {
    const result = _nonEmptyArray(val);
    if (!result && _nonEmptyString(message)) {
      throw new CustomError(message);
    }
    return result;
  }

  /**
   * @description Validate if input value is a number
   * @static
   * @param {number} val - Input value
   * @param {string} [message=''] - Message while checking fail
   * @returns {boolean} boolean
   * @throws {CustomError} Throws error when message is not empty
   * @memberof CustomValidator
   */
  static isNumber(val, message) {
    const result = _isNumber(val);
    if (!result && _nonEmptyString(message)) {
      throw new CustomError(message);
    }
    return result;
  }

  /**
   * @description Validate if two objects being equal
   * @static
   * @method
   * @param {object} var1
   * @param {object} var2
   * @param {string} [message=''] - Message while checking fail
   * @returns {boolean} boolean
   * @throws {CustomError} Throws error when message is not empty
   */
  static isEqual(var1, var2, message) {
    const result = _deepEqual(var1, var2);
    if (!result && _nonEmptyString(message)) {
      throw new CustomError(message);
    }
    return result;
  }
}

module.exports = CustomValidator;
