const fxRateController = require('../../src/controllers/fx-rate');
const markUpFeeRepository = require('../../src/repositories/mark-up-fee');
const apiMessages = require('../../src/utils/api-messages');
const fixerService = require('../../src/services/fixer');
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testing FX Rate controller', () => {
  describe('Testing get function', () => {
    const { rates } = fixerLatestResponse;

    beforeEach(() => {
      request.params = {
        pair: 'ARSBRL',
      };

      markUpFeeRepository.get.mockReturnValue(
        Promise.resolve(markUpFeeDocument)
      );

      fixerService.getEURBasedRates.mockReturnValue(Promise.resolve(rates));
    });

    it('should export a get function', () => {
      expect(typeof fxRateController.get).toBe('function');
    });

    it('should have two argument: request and h', () => {
      expect(fxRateController.get.length).toBe(2);
    });

    it('should call get function from MarkUpFee repository to check if fee exists', async () => {
      const { pair } = request.params;

      await fxRateController.get(request, h);

      expect(markUpFeeRepository.get).toBeCalledWith(pair);
    });

    it('should return 404 if mark up fee does not exists', async () => {
      const { code, message } = apiMessages.MARK_UP_FEE_DOES_NOT_EXISTS;

      markUpFeeRepository.get.mockReturnValue(Promise.resolve(null));

      await fxRateController.get(request, h);

      expect(h.response).toBeCalledWith({ message });
      expect(responseCode).toBeCalledWith(code);
    });

    it('should call getEURBasedRates method from fixer service to retrive the exchange list', async () => {
      await fxRateController.get(request, h);

      expect(fixerService.getEURBasedRates).toBeCalled();
    });

    it('should call calculateRateWithOutFee util function', async () => {
      await fxRateController.get(request, h);

      expect(rateUtils.calculateRateWithoutFee).toBeCalledWith(
        rates,
        markUpFeeDocument.pair
      );
    });

    it('should return 200 and formated response', async () => {
      const { pair, percentage } = markUpFeeDocument;
      const rateWithoutFee = rateUtils.calculateRateWithoutFee(
        rates,
        markUpFeeDocument.pair
      );
      const feeAmount = rateWithoutFee * percentage;
      const rateWithFee = rateWithoutFee + feeAmount;

      await fxRateController.get(request, h);

      expect(h.response).toBeCalledWith({
        pair,
        originalRate: rateWithoutFee,
        feePercentage: percentage,
        feeAmount,
        rateWithFee,
      });
      expect(responseCode).toBeCalledWith(200);
    });
  });

  describe('Testing getAll function', () => {
    const { rates } = fixerLatestResponse;
    const markUpFeeCollection = [markUpFeeDocument];

    beforeEach(() => {
      markUpFeeRepository.getAll.mockReturnValue(
        Promise.resolve(markUpFeeCollection)
      );

      fixerService.getEURBasedRates.mockReturnValue(Promise.resolve(rates));
    });

    it('should export a getAll function', () => {
      expect(typeof fxRateController.getAll).toBe('function');
    });

    it('should have two argument: request and h', () => {
      expect(fxRateController.getAll.length).toBe(2);
    });

    it('should call getAll function from MarkUpFee repository to check if fees exists', async () => {
      await fxRateController.getAll(request, h);

      expect(markUpFeeRepository.getAll).toBeCalledWith();
    });

    it('should call getEURBasedRates method from fixer service to retrive the exchange list', async () => {
      await fxRateController.getAll(request, h);

      expect(fixerService.getEURBasedRates).toBeCalled();
    });

    it('should call calculateRateWithOutFee util function for each fee', async () => {
      await fxRateController.getAll(request, h);

      expect(rateUtils.calculateRateWithoutFee).toBeCalledTimes(
        markUpFeeCollection.length
      );
    });

    it('should return 200 and formated response', async () => {
      const { pair, percentage } = markUpFeeDocument;
      const rateWithoutFee = rateUtils.calculateRateWithoutFee(
        rates,
        markUpFeeDocument.pair
      );
      const feeAmount = rateWithoutFee * percentage;
      const rateWithFee = rateWithoutFee + feeAmount;

      const formatedResponseForMarkUpFeeDocument = {
        pair,
        originalRate: rateWithoutFee,
        feePercentage: percentage,
        feeAmount,
        rateWithFee,
      };

      await fxRateController.getAll(request, h);

      expect(h.response).toBeCalledWith({
        markUpFees: [formatedResponseForMarkUpFeeDocument],
      });
      expect(responseCode).toBeCalledWith(200);
    });
  });
});
