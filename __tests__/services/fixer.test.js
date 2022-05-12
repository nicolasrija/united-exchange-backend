const fixerService = require('../../src/services/fixer');
const mockAxios = require('axios');
const config = require('config');
const { fixerLatestResponse } = require('../data');

const {
  base_url: baseURL,
  access_key: accessKey,
  timeout,
} = config.get('fixer');

describe('Testing Fixer service', () => {
  it('should create an axios instance with fixer base url', () => {
    require('../../src/services/fixer');

    expect(mockAxios.create).toBeCalledWith({
      baseURL,
      timeout,
    });
  });

  describe('Testing getEURBasedRates function', () => {
    const axiosResponse = {
      data: fixerLatestResponse,
    };
    mockAxios.get.mockReturnValue(Promise.resolve(axiosResponse));

    it('should export getEURBasedRates function', () => {
      expect(typeof fixerService.getEURBasedRates).toBe('function');
    });

    it('should call post method from axios intance to interact with Fixer api', async () => {
      await fixerService.getEURBasedRates();

      expect(mockAxios.get).toBeCalledWith(`/latest?access_key=${accessKey}`);
    });

    it('should return fixer api response', async () => {
      const result = await fixerService.getEURBasedRates();

      expect(result).toBe(axiosResponse.data.rates);
    });
  });
});
