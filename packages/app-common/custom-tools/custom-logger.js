const { createLogger, format, transports } = require('winston');
const DailyRotate = require('winston-daily-rotate-file');
const os = require('os');
const argvs = require('./custom-argvs');
const tracer = require('./custom-request-tracer');

const _HOST_NAME = os.hostname().toLowerCase();
const _CONSOLE_ENV = ['development', 'test'];

const _tracerPrinter = format.printf((info) => {
  const id = tracer.getId();
  return id
    ? `${info.timestamp} ${info.level} [${process.pid}][${id}] - ${info.message}`
    : `${info.timestamp} ${info.level} [${process.pid}] - ${info.message} `;
});
const _basicFormatter = format.combine(format.timestamp(), _tracerPrinter);
const _dailyLog = new DailyRotate({
  auditFile: `${argvs.logpath}/${_HOST_NAME}.json`,
  filename: `${_HOST_NAME}.log.%DATE%`,
  dirname: `${argvs.logpath}`,
  maxFiles: '14d',
  // maxSize: '10m',
  level: 'info',
  format: _basicFormatter,
});
const _consoleLog = new transports.Console({
  level: _CONSOLE_ENV.includes(process.env.NODE_ENV) ? 'info' : 'error',
  format: _basicFormatter,
});
const _defaultLogger = createLogger()
  .add(_dailyLog)
  .add(_consoleLog);

module.exports = _defaultLogger;
