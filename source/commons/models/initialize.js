const logger = require('../logger/logger');
const MongoDB = require('./mongo/runMongo');

(async () => {
  try {
    await MongoDB();
    logger.info('MongoDB connection established!');

  } catch (e) {
    logger.error('Failed to initialize one or more db connections =>', e);
  }
})()