const markUpFeeController = require('../../src/controllers/mark-up-fee');
const markUpFeeRepository = require('../../src/repositories/mark-up-fee');
const fixerService = require('../../src/services/fixer');
const apiMessages = require('../../src/utils/api-messages');
const { markUpFeeDocument, fixerLatestResponse } = require('../data');
const rateUtils = require('../../src/utils/rate');

jest.mock('../../src/repositories/mark-up-fee');
jest.mock('../../src/services/fixer');
jest.mock('../../src/utils/rate');

const request = {};

const responseCode = jest.fn();
const h = {
  response: jest.fn().mockReturnValue({
    code: responseCode,
  }),
};

describe('Testing Mark Up Fee controller', () => {
  describe('Testing create method', () => {
    beforeEach(() => {
      request.payload = {
        pair: 'ARSBRL',
        percentage: 5,
      };

      fixerService.getEURBasedRates.mockReturnValue(
        Promise.resolve(fixerLatestResponse.rates)
      );
      rateUtils.validatePair.mockReturnValue(true);
    });

    it('should export a create function', () => {
      expect(typeof markUpFeeController.create).toBe('function');
    });

    it('should have two argument: request and h', () => {
      expect(markUpFeeController.create.length).toBe(2);
    });

    it('should call getEURBasedRates method from fixer service to retrive the exchange list', async () => {
      await markUpFeeController.create(request, h);

      expect(fixerService.getEURBasedRates).toBeCalled();
    });

    it('should call validatePair util function', async () => {
      await markUpFeeController.create(request, h);

      expect(rateUtils.validatePair).toBeCalledWith(
        fixerLatestResponse.rates,
        request.payload.pair
      );
    });

    it('should return 400 if invalid pair is provided', async () => {
      const { code, message } = apiMessages.PAIR_NOT_SUPPORTED;

      rateUtils.validatePair.mockReturnValue(false);

      await markUpFeeController.create(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });

    it('should call get function from MarkUpFee repository to check if fee exists', async () => {
      const { pair } = request.payload;

      await markUpFeeController.create(request, h);

      expect(markUpFeeRepository.get).toBeCalledWith(pair);
    });

    it('should return 400 if mark-up fee exists', async () => {
      const { code, message } = apiMessages.MARK_UP_FEE_ALREADY_EXISTS;

      markUpFeeRepository.get.mockReturnValue(
        Promise.resolve(markUpFeeDocument)
      );

      await markUpFeeController.create(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });

    it('should call create function form MarkUpFee repository if mark-up fee does not exists', async () => {
      await markUpFeeController.create(request, h);

      expect(markUpFeeRepository.create).toBeCalledWith(request.payload);
    });

    it('should return 201', async () => {
      const { code, message } = apiMessages.MARK_UP_FEE_CREATED;

      await markUpFeeController.create(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });
  });

  describe('Testing getAll method', () => {
    it('should export a getAll function', () => {
      expect(typeof markUpFeeController.getAll).toBe('function');
    });

    it('should have two argument: request and h', () => {
      expect(markUpFeeController.getAll.length).toBe(2);
    });

    it('should call getAll function from MarkUpFee repository', async () => {
      await markUpFeeController.getAll(request, h);

      expect(markUpFeeRepository.getAll).toBeCalled();
    });

    it('should return 200 with the mark-up fees collection', async () => {
      const markUpFeeCollection = [markUpFeeDocument];
      markUpFeeRepository.getAll.mockReturnValue(markUpFeeCollection);

      await markUpFeeController.getAll(request, h);

      expect(h.response).toBeCalledWith({ markUpFees: markUpFeeCollection });
      expect(responseCode).toBeCalledWith(200);
    });
  });

  describe('Testing update method', () => {
    request.payload = {
      percentage: 5,
    };
    request.params = {
      pair: 'ARSBRL',
    };

    it('should export a update function', () => {
      expect(typeof markUpFeeController.update).toBe('function');
    });

    it('should have two argument: request and h', () => {
      expect(markUpFeeController.update.length).toBe(2);
    });

    it('should call get function from MarkUpFee repository to check if fee exists', async () => {
      const { pair } = request.params;

      await markUpFeeController.update(request, h);

      expect(markUpFeeRepository.get).toBeCalledWith(pair);
    });

    it('should return 404 if mark up fee does not exists', async () => {
      const { code, message } = apiMessages.MARK_UP_FEE_DOES_NOT_EXISTS;

      markUpFeeRepository.get.mockReturnValue(Promise.resolve(null));

      await markUpFeeController.update(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });

    it('should call update function form MarkUpFee repository if mark-up fee exists', async () => {
      markUpFeeRepository.get.mockReturnValue(
        Promise.resolve(markUpFeeDocument)
      );

      await markUpFeeController.update(request, h);

      expect(markUpFeeRepository.update).toBeCalledWith(
        markUpFeeDocument,
        request.payload.percentage
      );
    });

    it('should return 200', async () => {
      const { code, message } = apiMessages.MARK_UP_FEE_UPDATED;

      await markUpFeeController.create(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });
  });
});
