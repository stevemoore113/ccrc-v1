const path = require('path');
const Koa = require('koa');
const body = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');
const { tools } = require('@ccrc/app-common');
const AppInterceptor = require('./app-interceptor');
const apiV1Router = require('./api-v1-router');

const _bodyOptions = {
  jsonLimit: '10mb',
};

const _publicPath = '../../../public';

const _app = new Koa();
_app.use(mount('/js', serve(path.resolve(__dirname, `${_publicPath}/js`))));
_app.use(mount('/css', serve(path.resolve(__dirname, `${_publicPath}/css`))));
_app.use(mount('/imgs', serve(path.resolve(__dirname, `${_publicPath}/images`))));
_app.use(mount('/locales', serve(path.resolve(__dirname, `${_publicPath}/locales`))));
_app.use(mount('/api-docs', serve(path.resolve(__dirname, `${_publicPath}/api-docs`))));
_app.use(body(_bodyOptions));
_app.use(tools.customRequestTracer.forKoa());
_app.use(AppInterceptor.beforeHandler);
_app.use(AppInterceptor.errorHandler);
_app.use(apiV1Router.routes());
_app.use(AppInterceptor.completeHandler);
_app.use(AppInterceptor.notFoundHandler);

module.exports = _app;
