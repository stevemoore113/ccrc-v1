const tools = require('./custom-tools');
const models = require('./custom-models');
const codes = require('./custom-codes');

module.exports = {
  tools,
  models,
  codes,
  LOGGER: tools.customLogger,
};
