const rateUtils = require('../../src/utils/rate');
const { fixerRates } = require('../data');

describe('Testing Rate utils', () => {
  describe('Testing calculateRateWithoutFee function', () => {
    it('should be a function', () => {
      expect(typeof rateUtils.calculateRateWithoutFee).toBe('function');
    });

    it('should have two arguments: pair, rates', () => {
      expect(rateUtils.calculateRateWithoutFee.length).toBe(2);
    });

    it('should split the string pair', () => {
      const substringSpy = jest.spyOn(String.prototype, 'substring');

      rateUtils.calculateRateWithoutFee(fixerRates, 'AUDGBP');

      expect(substringSpy).toBeCalledWith(0, 3);
      expect(substringSpy).toBeCalledWith(3);
    });

    it('should return the exchange rate if base currency is EUR', () => {
      const rate = rateUtils.calculateRateWithoutFee(fixerRates, 'EURGBP');

      expect(rate).toBe(fixerRates['GBP']);
    });

    it('should calculate the inverse rate if quote currency is EUR', () => {
      const rate = rateUtils.calculateRateWithoutFee(fixerRates, 'GBPEUR');

      expect(rate).toBe(1 / fixerRates['GBP']);
    });

    it('should calculate the exchange rate between two given currencies', () => {
      const rateAUDGBP = rateUtils.calculateRateWithoutFee(
        fixerRates,
        'AUDGBP'
      );

      expect(rateAUDGBP).toBeCloseTo(0.563243009);
    });
  });

  describe('Testing validatePair function', () => {
    it('should be a function', () => {
      expect(typeof rateUtils.validatePair).toBe('function');
    });

    it('should have two arguments: rates, pair', () => {
      expect(rateUtils.validatePair.length).toBe(2);
    });

    it('should split the string pair', () => {
      const substringSpy = jest.spyOn(String.prototype, 'substring');

      rateUtils.validatePair(fixerRates, 'AUDGBP');

      expect(substringSpy).toBeCalledWith(0, 3);
      expect(substringSpy).toBeCalledWith(3);
    });

    it('should return true if base currency is EUR and other valid currency', () => {
      const result = rateUtils.validatePair(fixerRates, 'EURGBP');

      expect(result).toBeTruthy();
    });

    it('should return true if quote currency is EUR and other valid currency', () => {
      const result = rateUtils.validatePair(fixerRates, 'GBPEUR');

      expect(result).toBeTruthy();
    });

    it('should return true if provided with two valid currencies', () => {
      const result = rateUtils.validatePair(fixerRates, 'GBPAUD');

      expect(result).toBeTruthy();
    });

    it('should return false if base currency is invalid', () => {
      const result = rateUtils.validatePair(fixerRates, 'ABCAUD');

      expect(result).toBeFalsy();
    });

    it('should return false if quote currency is invalid', () => {
      const result = rateUtils.validatePair(fixerRates, 'GBPABC');

      expect(result).toBeFalsy();
    });

    it('should return false if its provided with two invalid currencies', () => {
      const result = rateUtils.validatePair(fixerRates, 'ABCDEF');

      expect(result).toBeFalsy();
    });
  });
});
