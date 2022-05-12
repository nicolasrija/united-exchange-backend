const { MarkUpFee } = require('../models');

const create = async (fee) => {
  const markUpFee = await MarkUpFee.create({
    pair: fee.pair,
    percentage: fee.percentage,
  });

  return markUpFee;
};

const get = async (pair) => {
  const markUpFee = await MarkUpFee.findOne({ pair });

  return markUpFee;
};

const update = async (markUpFee, newPercentage) => {
  markUpFee.percentage = newPercentage;
  await markUpFee.save();

  return markUpFee;
};

const getAll = async () => {
  const markUpFees = await MarkUpFee.find({});

  return markUpFees;
};

module.exports = {
  create,
  get,
  update,
  getAll,
};
