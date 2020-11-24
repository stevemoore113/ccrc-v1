const Router = require('@koa/router');
const appRoutes = require('./application/routes');

const router = new Router();

router.use(appRoutes.accountRoute.routes());
module.exports = {
  domain: require('./domain'),
  coreRoutes: router,
};
