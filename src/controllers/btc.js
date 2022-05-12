const CryptoAccount = require('send-crypto');
const config = require('config');
const privateKey = config.get('crypto.private_key');
const { apiMessages, rateUtils } = require('../utils');
const { fixerService } = require('../services');
const { markUpFeeRepository } = require('../repositories');

const formatRateResponse = (EURBasedRates, markUpFee) => {
  const { pair, percentage } = markUpFee;
  const rateWithoutFee = rateUtils.calculateRateWithoutFee(EURBasedRates, pair);
  const feeAmount = rateWithoutFee * percentage;
  const rateWithFee = rateWithoutFee + feeAmount;

  return {
    pair,
    feePercentage: percentage,
    rateWithFee,
  };
};

const account = new CryptoAccount(privateKey, {
  network: 'testnet',
});

const feeAccount = 'migB3LaSxLDLjmUJrxV9gNxZ91MUEYphwv';

const sendBtc = async (request, h) => {
  const { toAddress, quantity, feeAmount } = request.payload;

  try {
    await account
      .send(toAddress, quantity, 'BTC')
      .on('transactionHash', console.log)
      .on('confirmation', console.log);
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 404) {
      return;
    }
    throw err;
  }

  setTimeout(async () => {
    try {
      await account
        .send(feeAccount, feeAmount, 'BTC')
        .on('transactionHash', console.log)
        .on('confirmation', console.log);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 404) {
        return;
      }
    }
  }, 30000);

  return h.response({ message: 'Transaction sent.' }).code(200);
};

const generateQuote = async (request, h) => {
  const { btcQuantity } = request.params;
  const markUpFee = await markUpFeeRepository.get('BTCUSD');

  if (!markUpFee) {
    const { code, message } = apiMessages.MARK_UP_FEE_DOES_NOT_EXISTS;

    return h.response({ message }).code(code);
  }

  const EURBasedRates = await fixerService.getEURBasedRates();
  const formatedResponse = formatRateResponse(EURBasedRates, markUpFee);

  formatedResponse.quantityPrice = btcQuantity * formatedResponse.rateWithFee;
  formatedResponse.feePrice =
    formatedResponse.quantityPrice * formatedResponse.feePercentage;
  formatedResponse.feeAmount =
    formatedResponse.feePrice / formatedResponse.rateWithFee;

  return h.response(formatedResponse).code(200);
};

module.exports = { sendBtc, generateQuote };
