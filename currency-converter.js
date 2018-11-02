const axios = require("axios");

// USD, CAD

// fixer.io uir
const fixerUri =
  "http://data.fixer.io/api/latest?access_key=04ccead921db1924d378aec5ddd2f2da&format=1";

// restcountries uri
const restCountry = "https://restcountries.eu/rest/v2/currency/";

const getExchangeRate = async (from, to) => {
  try {
    const response = await axios.get(fixerUri);
    const euro = 1 / response.data.rates[from];
    const rate = euro * response.data.rates[to];
    if (isNaN(rate)) {
      throw new Error();
    }
    return rate;
  } catch (e) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
  }
};

const getCountries = async currencyCode => {
  try {
    const response = await axios.get(`${restCountry}${currencyCode}`);
    return response.data.map(country => {
      return country.name;
    });
  } catch (e) {
    throw new Error(`Unable to get countries list for ${currencyCode}`);
  }
};

const convertedCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to);
  const convertedAmount = (amount * rate).toFixed(2);
  const countries = await getCountries(to);
  return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend these in the following countries: ${countries.join(
    ", "
  )}`;
};

convertedCurrency("USD", "GBP", 20)
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e.message);
  });
