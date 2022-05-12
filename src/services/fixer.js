const axios = require('axios');
const config = require('config');

const {
  base_url: baseURL,
  access_key: accessKey,
  timeout,
} = config.get('fixer');

const axiosInstance = axios.create({
  baseURL,
  timeout,
});

const getEURBasedRates = async () => {
  const response = await axiosInstance.get(`/latest?access_key=${accessKey}`);

  return response.data.rates;
};

module.exports = {
  getEURBasedRates,
};
