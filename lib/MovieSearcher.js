const request = require("request");

//returns a Promise which we can handle in bot.js
const findMovie = name => {
  return new Promise((resolve, reject) => {
    request(
      `http://www.omdbapi.com/?apikey=${process.env.API_KEY_MOVIE}=${name}`,
      function(error, response, body) {
        if (response && response.statusCode != 200) {
          reject("status " + response.statusCode);
        } else {
          resolve(JSON.parse(body));
        }
      }
    );
  });
};

module.exports = { findMovie };
