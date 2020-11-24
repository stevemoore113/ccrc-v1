const { models } = require('@ccrc/app-common');

const _codeEnum = {
  ERR_EMAIL_EMPTY: 'ERR_EMAIL_EMPTY',

};
/**
 * @type {Array.<errorCodeObject>}
 */
const _errs = [];
_errs.push({
  alias: _codeEnum.ERR_EMAIL_EMPTY,
  code: 10001,
  httpStatus: 400,
  message: 'email is empty',
});

models.CustomError.mergeCodes(_errs);

module.exports = _codeEnum;
