const request = require("request");

//returns a Promise which we can handle in bot.js
const getWeatherByCity = city => {
  return new Promise((resolve, reject) => {
    request(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY_WEATHER}`,
      function(error, response, body) {
        if (response && response.statusCode != 200) {
          reject("status " + response.statusCode);
        } else {
          const data = JSON.parse(body);
          // const name = data.city.name
          // const { name } = data.city;
          const {
            city: { name },
            list: [
              {
                main: { temp }
              },
              {
                weather: [{ main }]
              }
            ]
          } = data;
          resolve({
            name,
            main,
            temp: Math.ceil(temp - 273.15)
          });
        }
      }
    );
  });
};

module.exports = { getWeatherByCity };

// const person = {
//   name: "John",
//   pets: [
//     {
//       nick: "Sharik"
//     },
//     {
//       nick: "Danil"
//     }
//   ]
// };

// person.pets[0].nick;

// const {
//   pets: [a, { nick }]
// } = person;
