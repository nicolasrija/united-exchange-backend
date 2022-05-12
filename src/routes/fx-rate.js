const { fxRateController } = require('../controllers');

module.exports = [
  {
    method: 'GET',
    path: '/fx-rates',
    handler: fxRateController.getAll,
  },

  {
    method: 'GET',
    path: '/fx-rates/{pair}',
    handler: fxRateController.get,
  },
];
