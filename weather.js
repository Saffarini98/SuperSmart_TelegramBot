const weather = function(bot) {
  bot.onText(/\/weather/, (msg, match) => {
    const chatId = msg.chat.id;
    // const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${process.env.API_KEY}`;

    // request(url, function(error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     const res = JSON.parse(body);
    //   }
    // });
    bot.sendMessage(chatId, "Choose the city", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Moscow",
              callback_data: "City Moscow"
            },
            {
              text: "STHLM",
              callback_data: "STHLM"
            },
            {
              text: "Dubai",
              callback_data: "Dubai"
            },
            {
              text: "London",
              callback_data: "London"
            }
          ]
        ]
      }
    });
  });

  // bot.on(/City (.+)/, callbackQuery => {
  //   const msg = callbackQuery.message;
  //   console.log(msg);

  //   bot
  //     .answerCallbackQuery(callbackQuery.id)
  //     .then(() => bot.sendMessage(chatId, "You clicked!"));

  // });

  bot.onText(/City (.+)/, (msg, match) => {
    const city = match[1];
    console.log(city);
    bot.sendMessage(msg.chat.id, city);
    // bot
    //   .answerCallbackQuery(callbackQuery.id)
    //   .then(() => bot.sendMessage(chatId, "You clicked!"));
  });
};

module.exports = weather;
