const yargs = require('yargs');

const _argvs = yargs
  .options({
    logpath: {
      demandOption: false,
      describe: 'Set the logger path',
      default: './logs',
    },
    port: {
      demandOption: false,
      alias: 'p',
      describe: 'Set the http server port',
      default: '9000',
    },
    env: {
      demandOption: false,
      describe: 'Set the execute environment, should be local|dev|prod',
      default: process.env.NODE_ENV || 'test',
    },
    configpath: {
      demandOption: false,
      describe: 'Set the config file path absolutely, default is empty',
      default: '',
    },
  })
  .help()
  .alias('help', 'h')
  .epilogue('Copyright@hand').argv;

module.exports = _argvs;
