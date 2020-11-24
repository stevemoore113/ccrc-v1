/**
 * For Node 10 users:
 * Node 10.0.x-10.3.x is not supported. That's because V8 version 6.6 introduced a bug
 * that breaks async_hooks during async/await. Node 10.4.x uses V8 v6.7 where the bug is fixed.
 * See: https://github.com/nodejs/node/issues/20274.
 * @private
 */

const cls = require('cls-hooked');
const uuid = require('uuid');

const _nameSpaceId = `tracer:${uuid.v4()}`;
const _nameSpace = cls.createNamespace(_nameSpaceId);

/**
 * @ignore
 * @description Middleware to provide express
 * @function
 * @param {Object} options
 * @param {boolean} [options.useHeader=true] - Save request id to header or not, default to false
 * @param {string} [options.headerName='X-Request-Id'] - key name to save request id, default is "X-Request-Id"
 * @returns {function} Stander express middleware function
 */
const _expressMiddleware = ({
  useHeader = true,
  headerName = 'X-Request-Id',
} = {}) => (req, res, next) => {
  _nameSpace.bindEmitter(req);
  _nameSpace.bindEmitter(res);

  let requestId;
  if (useHeader) {
    requestId = req.headers[headerName.toLowerCase()];
  }
  requestId = requestId || uuid.v4();
  _nameSpace.run(() => {
    _nameSpace.set('requestId', requestId);
    next();
  });
};
/**
 * @ignore
 * @description Middleware to provide to koa
 * @function
 * @param {Object} options
 * @param {boolean} [options.useHeader=true] - Save request id to header or not, default to false
 * @param {string} [options.headerName='X-Request-Id'] - key name to save request id, default is "X-Request-Id"
 * @returns {function} Stander koa middleware function
 */
const _koaMiddleware = ({
  useHeader = true,
  headerName = 'X-Request-Id',
} = {}) => (ctx, next) => {
  _nameSpace.bindEmitter(ctx.req);
  _nameSpace.bindEmitter(ctx.res);

  let requestId;
  if (useHeader) {
    requestId = ctx.request.headers[headerName.toLowerCase()];
  }
  requestId = requestId || uuid.v4();

  return new Promise(_nameSpace.bind((res, rej) => {
    _nameSpace.set('requestId', requestId);
    return next().then(res).catch(rej);
  }));
};
/**
 * @ignore
 * @description Get tracer id
 * @function
 * @returns {string} An unique id of each request
 */
const _getId = () => {
  if (_nameSpace && _nameSpace.active) {
    return _nameSpace.get('requestId');
  }
  return '';
};

module.exports = {
  forExpress: _expressMiddleware,
  forKoa: _koaMiddleware,
  getId: _getId,
};
