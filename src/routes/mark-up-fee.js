const Joi = require('joi');
const { markUpFeeController } = require('../controllers');

module.exports = [
  {
    method: 'POST',
    path: '/mark-up-fees',
    handler: markUpFeeController.create,
    options: {
      validate: {
        payload: Joi.object({
          pair: Joi.string().min(6).max(6).uppercase().required(),
          percentage: Joi.number().min(0).max(1).required(),
        }),
      },
    },
  },

  {
    method: 'GET',
    path: '/mark-up-fees',
    handler: markUpFeeController.getAll,
  },

  {
    method: 'PUT',
    path: '/mark-up-fees/{pair}',
    handler: markUpFeeController.update,
    options: {
      validate: {
        payload: Joi.object({
          percentage: Joi.number().min(0).max(1).required(),
        }),
      },
    },
  },
];
