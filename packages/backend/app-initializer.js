const conf = require('@ccrc/app-common/shared/config');
const { DefaultDBClient } = require('@ccrc/app-common/shared/connection-clients');
const { LOGGER } = require('@ccrc/app-common');

/**
 * @class
 * @classdesc Describe app initializer
 */
class AppInitializer {
  /**
   * @static
   * @async
   * @description Try to create and connect to default database
   * @returns {Promise.<void>} Promise.<void>
   * @throws {Error} error
   */
  static async tryDefaultDatabase() {
    const def = conf.DATABASES.DEFAULT_MONGO;
    LOGGER.info(`Try to create default database, connect to ${def.DB_NAME}`);
    await DefaultDBClient.create(def.URI, {
      user: def.USER,
      pass: def.PASS,
      poolSize: def.POOL_SIZE,
      dbName: def.DB_NAME,
    });
  }
}

module.exports = AppInitializer;
