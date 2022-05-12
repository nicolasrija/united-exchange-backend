const splitPair = (pair) => {
  const base = pair.substring(0, 3);
  const quote = pair.substring(3);

  return [base, quote];
};

const calculateRateWithoutFee = (EURBasedRates, pair) => {
  const [base, quote] = splitPair(pair);

  if (base === 'EUR') {
    return EURBasedRates[quote];
  }

  const baseRate = EURBasedRates[base];
  const baseRateToEUR = 1 / baseRate;

  if (quote === 'EUR') {
    return baseRateToEUR;
  }

  const quoteRate = EURBasedRates[quote];
  const foreignRate = baseRateToEUR * quoteRate;

  return foreignRate;
};

const validatePair = (EURBasedRates, pair) => {
  const [base, quote] = splitPair(pair);

  if (base === 'EUR') {
    return true && EURBasedRates[quote];
  }

  if (quote === 'EUR') {
    return true && EURBasedRates[base];
  }
  const baseRate = EURBasedRates[base];
  const quoteRate = EURBasedRates[quote];

  return baseRate && quoteRate;
};

module.exports = { calculateRateWithoutFee, validatePair };
