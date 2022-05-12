const { markUpFeeRepository } = require('../repositories');
const { apiMessages, rateUtils } = require('../utils');
const { fixerService } = require('../services');

const formatRateResponse = (EURBasedRates, markUpFee) => {
  const { pair, percentage } = markUpFee;
  const rateWithoutFee = rateUtils.calculateRateWithoutFee(EURBasedRates, pair);
  const feeAmount = rateWithoutFee * percentage;
  const rateWithFee = rateWithoutFee + feeAmount;

  return {
    pair,
    originalRate: rateWithoutFee,
    feePercentage: percentage,
    feeAmount,
    rateWithFee,
  };
};

const get = async (request, h) => {
  const { pair } = request.params;
  const markUpFee = await markUpFeeRepository.get(pair);

  if (!markUpFee) {
    const { code, message } = apiMessages.MARK_UP_FEE_DOES_NOT_EXISTS;

    return h.response({ message }).code(code);
  }

  const EURBasedRates = await fixerService.getEURBasedRates();
  const formatedResponse = formatRateResponse(EURBasedRates, markUpFee);

  return h.response(formatedResponse).code(200);
};

const getAll = async (request, h) => {
  const markUpFees = await markUpFeeRepository.getAll();
  const EURBasedRates = await fixerService.getEURBasedRates();

  const formatedResponse = markUpFees.map((fee) => {
    return formatRateResponse(EURBasedRates, fee);
  });

  return h
    .response({
      markUpFees: formatedResponse,
    })
    .code(200);
};

module.exports = { get, getAll };
