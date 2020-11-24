/* eslint-disable no-use-before-define */
const { Mongoose, Schema } = require('mongoose');
const { customLogger, customArgvs, CustomValidator } = require('../../custom-tools');

/**
 * @ignore
 * @private
 * @type {Mongoose}
 */
let _instance = null;

/**
 * @ignore
 * @private
 * @type {import('mongoose').Connection}
 */
let _conn = null;

/**
 * @ignore
 * @private
 * @type {boolean}
 */
let _isConnected = false;

/**
 * @ignore
 * @private
 * @type {Map.<string, import('mongoose').Model>}
 */
const _docs = new Map();
let _defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,
  user: '',
  pass: '',
  dbName: '',
  connectTimeoutMS: 3 * 1000,
};
let _uri = '';
let _numberOfRetries = 0;
const _REJ_CLN_ENV = ['production', 'development'];

/**
 * @class
 * @classdesc Describe default database client
 */
class DefaultDBClient {
  /**
   * @description Get connection state
   * @static
   * @member
   * @returns {boolean} boolean
   */
  static get isConnected() {
    return _isConnected;
  }

  /**
 * @description Create db instance
 * @static
 * @async
 * @method
 * @param {string} uri
 * @param {object} options
 * @param {number} options.poolSize [options.poolSize=5] - Pool size of mongo client
 * @param {string} options.user [options.user=''] - User name for login mongodb
 * @param {string} options.pass [options.pass=''] - Password for login mongodb
 * @param {string} options.dbName [options.dbName=''] - Database name for using
 * @returns {void} void
 * @throws {Error} error
 */
  static async create(uri, options) {
    if (!CustomValidator.nonEmptyString(uri)) {
      throw new Error('Connect uri is empty');
    }
    _uri = uri;
    if (options && Object.keys(options).length > 0) {
      _defaultOptions = { ..._defaultOptions, ...options };
    }
    if (!CustomValidator.nonEmptyString(_defaultOptions.user)) {
      delete _defaultOptions.user;
      delete _defaultOptions.pass;
    }
    _instance = new Mongoose();
    _instance.set('useCreateIndex', true);
    return DefaultDBClient.tryConnect();
  }

  /**
   * @description Try connect to DB
   * @async
   * @static
   * @method
   * @returns {Promise.<void>} Promise.<void>
   */
  static tryConnect() {
    customLogger.info(`Try connecting for ${_numberOfRetries} counts`);
    _conn = _instance.createConnection(_uri, _defaultOptions);
    _conn.on('connected', _onConnected);
    _conn.on('error', _onError);
    _conn.on('close', _onClose);
    _conn.on('disconnected', _onDisconnected);
    return new Promise((res) => {
      _conn.once('open', () => {
        customLogger.info('Db opened...');
        res();
      });
    });
  }

  /**
   * @description Register schema
   * @static
   * @async
   * @param {string} name
   * @param {Schema} schema
   * @returns {void} void
   * @throws {Error} error
   */
  static registerCollection(name, schema) {
    if (!CustomValidator.nonEmptyString(name)) {
      throw new Error('Model name must not be empty');
    }
    if (!schema || !(schema instanceof Schema)) {
      throw new Error('Schema type was worng');
    }
    if (_docs.has(name)) {
      throw new Error(`Duplicate model name ${name} was founded`);
    }
    const m = _conn.model(name, schema);
    _docs.set(name, m);
    customLogger.info(`Default Db client - ${name} registered`);
  }

  /**
   * @description Get model by name
   * @static
   * @method
   * @param {string} modelCode
   * @returns {import('mongoose').Model}
   * @throws {Error} error
   */
  static getCollection(modelCode) {
    if (!CustomValidator.nonEmptyString(modelCode)) {
      throw new Error('Collection name is empty');
    }
    if (!_docs.has(modelCode)) {
      throw new Error(`Collection ${modelCode} is not founded`);
    }
    return _docs.get(modelCode);
  }

  /**
   * @description Clear data
   * @static
   * @async
   * @returns {Promise.<void>} Promise.<void>
   */
  static async clearData() {
    if (_REJ_CLN_ENV.includes(customArgvs.env)) {
      customLogger.info(`Not allowed to clean ${customArgvs.env}`);
      return;
    }
    const tasks = [];
    for (const [k, v] of _docs.entries()) {
      customLogger.info(`Default Db client - clear ${k} data`);
      tasks.push(v.deleteMany());
    }
    await Promise.all(tasks);
  }

  /**
   * @description Close db connection
   * @method
   * @returns {Promise.<void>} Promise.<void>
   */
  static async close() {
    _conn.removeAllListeners();
    return _conn.close();
  }
}

module.exports = DefaultDBClient;

/**
 * @ignore
 * @private
 * @function
 * @description on connected event
 * @returns {void} void
 */
function _onConnected() {
  _isConnected = true;
  _numberOfRetries = 0;
  customLogger.info('Connect to db success');
}

/**
 * @ignore
 * @private
 * @function
 * @description on db disconnected
 * @returns {void} void
 */
function _onDisconnected() {
  _isConnected = false;
  _numberOfRetries += 1;
  _conn.removeAllListeners();
  customLogger.info('Db disconnected...');
  DefaultDBClient.tryConnect();
}

/**
 * @ignore
 * @private
 * @function
 * @description on close event
 * @returns {void} void
 */
function _onClose() {
  _isConnected = false;
  customLogger.info('Db connnection closed');
}

/**
 * @ignore
 * @private
 * @function
 * @description on error event
 * @returns {void} void
 */
function _onError(err) {
  _isConnected = false;
  customLogger.error(`Connect to db fail ${err.stack}`);
  DefaultDBClient.tryConnect();
}
