const Router = require('@koa/router');
const { models, codes } = require('@ccrc/app-common');

const _router = new Router();

_router.prefix('/api/v1');
_router.all('/throws', async () => {
  throw new models.CustomError(codes.errorCodes.ERR_EXCEPTION);
});
_router.all('/', async (ctx, next) => {
  ctx.state.result = new models.CustomResult();
  return next();
});

module.exports = _router;
