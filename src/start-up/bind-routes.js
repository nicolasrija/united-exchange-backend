const { markUpFeeRoutes, fxRateRoutes, btcRoutes } = require('../routes');

module.exports = (server) => {
  server.route([...markUpFeeRoutes, ...fxRateRoutes, ...btcRoutes]);
};
