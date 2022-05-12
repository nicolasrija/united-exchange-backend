const { btcController } = require('../controllers');

module.exports = [
  {
    method: 'POST',
    path: '/btc/send-transaction',
    handler: btcController.sendBtc,
  },
  {
    method: 'GET',
    path: '/btc/generate-quote/{btcQuantity}',
    handler: btcController.generateQuote,
  },
];
