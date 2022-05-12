const { markUpFeeRepository } = require('../repositories');
const { fixerService } = require('../services');
const { apiMessages, rateUtils } = require('../utils');

const create = async (request, h) => {
  const { pair, percentage } = request.payload;
  const EURBasedRates = await fixerService.getEURBasedRates();

  if (!rateUtils.validatePair(EURBasedRates, pair)) {
    const { code, message } = apiMessages.PAIR_NOT_SUPPORTED;

    return h.response({ message }).code(code);
  }

  const markUpFee = await markUpFeeRepository.get(pair);

  if (markUpFee) {
    const { code, message } = apiMessages.MARK_UP_FEE_ALREADY_EXISTS;
    return h.response({ message }).code(code);
  }

  await markUpFeeRepository.create({ pair, percentage });
  const { code, message } = apiMessages.MARK_UP_FEE_CREATED;

  return h.response({ message }).code(code);
};

const getAll = async (request, h) => {
  const markUpFees = await markUpFeeRepository.getAll();

  return h.response({ markUpFees }).code(200);
};

const update = async (request, h) => {
  const { pair } = request.params;
  const markUpFee = await markUpFeeRepository.get(pair);

  if (!markUpFee) {
    const { code, message } = apiMessages.MARK_UP_FEE_DOES_NOT_EXISTS;

    return h.response({ message }).code(code);
  }

  const { payload } = request;
  await markUpFeeRepository.update(markUpFee, payload.percentage);
  const { code, message } = apiMessages.MARK_UP_FEE_UPDATED;

  return h.response({ message }).code(code);
};

module.exports = { create, getAll, update };
