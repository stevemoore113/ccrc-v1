/**
 * @class
 * @classdesc Represents common result
 * */
class CustomResult {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @description Id for tracing
     * @type {string}
     * @member
     */
    this.traceId = '';
    /**
     * @description The error code, 0 means success
     * @type {number}
     * @member
     */
    this.code = 0;
    /**
     * @description The error message, it will be empty when success
     * @type {string}
     * @member
     */
    this.message = '';
    /**
     * @description The result, it will be null when error code is greater than 0
     * @type {object}
     * @member
     */
    this.result = null;
  }

  /**
   * @method
   * @description Check whether result is successful
   * @returns {boolean} boolean
   */
  isSuccessful() {
    return Object.is(this.code, 0);
  }

  /**
   * @description Set error code
   * @param {string} traceId traceId
   * @returns {CustomResult} CustomResult
   */
  withTraceId(traceId) {
    this.traceId = traceId;
    return this;
  }

  /**
   * @description Set error code
   * @param {number} code code
   * @returns {CustomResult} CustomResult
   */
  withCode(code = 0) {
    this.code = code;
    return this;
  }

  /**
   * @description Set error message
   * @param {string} message message
   * @returns {CustomResult} CustomResult
   */
  withMessage(message = '') {
    this.message = message;
    return this;
  }

  /**
   * @description Set result object
   * @param {any} result result
   * @returns {CustomResult} CustomResult
   */
  withResult(result = null) {
    this.result = result;
    return this;
  }
}

module.exports = CustomResult;
