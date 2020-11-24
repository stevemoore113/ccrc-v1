const Router = require('@koa/router');
const { models, tools, LOGGER } = require('@ccrc/app-common');
const err = require('../../domain/enums/error-codes');

const _router = new Router();
_router.prefix('/accounts');

class AccountController {
  static async create(ctx, next) {
    if (!tools.CustomValidator.nonEmptyString(ctx.request.body.email)) {
      LOGGER.info('[10001]email is empty');
      throw new models.CustomError(err.ERR_EMAIL_EMPTY);
    }
    await next();
  }
}

_router
  .post('/', AccountController.create);

module.exports = _router;
