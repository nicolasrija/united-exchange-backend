const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  pair: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});

const MarkUpFee = mongoose.model('MarkUpFee', schema);

module.exports = MarkUpFee;
