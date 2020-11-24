global.Promise = require('bluebird');
const http = require('http');
const { LOGGER, tools } = require('@ccrc/app-common');
const { App, AppInit } = require('@ccrc/backend');

LOGGER.info('Initial app start...');
AppInit.tryDefaultDatabase().catch((ex) => LOGGER.error(ex.stack));

const _core = http.createServer(App.callback());
_core.listen(Number.parseInt(tools.customArgvs.port, 10));
_core.on('listening', () => LOGGER.info(`Server up on ${_core.address().port}`));
_core.on('error', (err) => LOGGER.error(err.stack));
