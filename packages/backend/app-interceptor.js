const { LOGGER, models, tools } = require('@ccrc/app-common');

/**
 * @class
 * @classdesc Describe app interceptor
 */
class AppInterceptor {
  /**
   * @static
   * @async
   * @description Before starting request handler
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   * @returns {Promise.<void>} Promise.<void>
   */
  static async beforeHandler(ctx, next) {
    LOGGER.info('-----------------------------------------------------------');
    LOGGER.info(`${ctx.method} ${ctx.path} - start`);
    return next();
  }

  /**
   * @static
   * @async
   * @description Before starting request handler
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   * @returns {Promise.<void>} Promise.<void>
   */
  // eslint-disable-next-line consistent-return
  static async errorHandler(ctx, next) {
    try {
      await next();
    } catch (ex) {
      let error = ex;
      if (!(error instanceof models.CustomError)) {
        LOGGER.error(error.stack);
        error = new models.CustomError(null, ex.message);
      }
      const result = new models.CustomResult()
        .withTraceId(tools.customRequestTracer.getId())
        .withCode(error.code)
        .withMessage(error.message);
      const str = `${ctx.method} ${ctx.originalUrl} - ${error.httpStatus} [${error.type}] ${error.message}`;
      if (error.isException()) {
        LOGGER.error(str);
      } else {
        LOGGER.warn(str);
      }
      ctx.status = error.httpStatus;
      ctx.body = result;
    }
  }

  /**
   * @static
   * @async
   * @description Before starting request handler
   * @param {import('koa').Context} ctx
   * @param {import('koa').Next} next
   * @returns {Promise.<void>} Promise.<void>
   */
  // eslint-disable-next-line consistent-return
  static async completeHandler(ctx, next) {
    if (!ctx.state.result) {
      return next();
    }
    LOGGER.info(`${ctx.method} ${ctx.originalUrl} - 200`);
    ctx.state.result.traceId = tools.customRequestTracer.getId();
    ctx.status = 200;
    ctx.body = ctx.state.result;
  }

  /**
   * @static
   * @async
   * @description Before starting request handler
   * @param {import('koa').Context} ctx
   * @returns {Promise.<void>} Promise.<void>
   */
  // eslint-disable-next-line consistent-return
  static async notFoundHandler(ctx) {
    LOGGER.info(`${ctx.method} ${ctx.originalUrl} - 404 Path not found`);
    ctx.status = 404;
    ctx.body = `${ctx.method} ${ctx.originalUrl} - 404 Path not found`;
  }
}

module.exports = AppInterceptor;
