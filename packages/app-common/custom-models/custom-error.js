const cmmErr = require('../custom-codes/error-codes');

const _errorCodeFields = ['alias', 'code', 'httpStatus', 'message'];
/**
 * @description Validate input error code object valid
 * @private
 * @param {errorCodeObject} errorMap
 * @returns {boolean} boolean
 */
function _validateErrorCodeFormat(errorMap = {}) {
  if (!errorMap) {
    return false;
  }
  const keys = Object.keys(errorMap);
  if (keys.length === 0 || keys.length !== 4) {
    return false;
  }
  for (const k of keys) {
    if (!_errorCodeFields.includes(k)) {
      return false;
    }
  }
  return true;
}

/**
 * @private
 * @type {Map.<string, errorCodeObject>}
 */
const _codeMap = new Map()
  .set(cmmErr.SUCCESS, {
    alias: cmmErr.SUCCESS,
    code: 0,
    httpStatus: 200,
    message: 'Success',
  })
  .set(cmmErr.ERR_EXEC_DB_FAIL, {
    alias: cmmErr.ERR_EXEC_DB_FAIL,
    code: 90001,
    httpStatus: 500,
    message: 'Database execution fail',
  })
  .set(cmmErr.ERR_JSON_FORMAT_FAIL, {
    alias: cmmErr.ERR_JSON_FORMAT_FAIL,
    code: 90002,
    httpStatus: 400,
    message: 'Invalid json format',
  })
  .set(cmmErr.ERR_DEPRECATED, {
    alias: cmmErr.ERR_DEPRECATED,
    code: 90003,
    httpStatus: 410,
    message: 'Depecated resources',
  })
  .set(cmmErr.ERR_NOT_IMPLEMENT, {
    alias: cmmErr.ERR_NOT_IMPLEMENT,
    code: 90004,
    httpStatus: 501,
    message: 'Not implemented',
  })
  .set(cmmErr.ERR_EXCEPTION, {
    alias: cmmErr.ERR_EXCEPTION,
    code: 99999,
    httpStatus: 500,
    message: 'Ops! Exception',
  });

/**
 * @class
 * @classdesc Describe custom error
 * @extends Error
 */
class CustomError extends Error {
  /**
   * @constructor
   * @param {string} codeType
   * @param {string} replaceString
   */
  constructor(codeType, replaceString) {
    super();
    let err = _codeMap.get(codeType);
    if (!err) {
      err = {
        alias: cmmErr.ERR_EXCEPTION,
        httpStatus: 500,
        code: 99999,
        message: codeType || 'Ops! Exception',
      };
    }
    this.type = err.code !== 99999 ? codeType : cmmErr.ERR_EXCEPTION;
    this.code = err.code;
    this.message = replaceString || err.message;
    this.name = this.constructor.name;
    this.httpStatus = err.httpStatus;
  }

  /**
   * @description Check if code is success(0)
   * @returns {boolean} boolean
   */
  isSuccess() {
    return Object.is(0, this.code);
  }

  /**
   * @description Check if code is exception(99999)
   * @returns {boolean} boolean
   */
  isException() {
    return Object.is(99999, this.code);
  }

  /**
   * @static
   * @description Merge error codes
   * @param {Array.<errorCodeObject>} codes
   * @returns {void} void
   * @throws {Error} error
   */
  static mergeCodes(codes) {
    if (!Array.isArray(codes) || codes.length === 0) {
      throw new Error('Cannot merge with an empty array');
    }
    for (const c of codes) {
      if (!_validateErrorCodeFormat(c)) {
        throw new Error('Illegal error code format');
      }
      if (_codeMap.has(c.alias)) {
        throw new Error(`Duplicate key ${c.alias} was defined`);
      }
      _codeMap.set(c.alias, c);
    }
  }
}

module.exports = CustomError;
