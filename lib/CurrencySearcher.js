const rp = require("request-promise");
const requestOptions = {
  method: "GET",
  uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  qs: {
    start: "1",
    limit: "5000",
    convert: "USD"
  },
  headers: {
    "X-CMC_PRO_API_KEY": "0e514683-80f5-400c-9a66-f8e8fc8cdd87"
  },
  json: true,
  gzip: true
};

rp(requestOptions)
  .then(response => {
    console.log("API call response:", response);
  })
  .catch(err => {
    console.log("API call error:", err.message);
  });
