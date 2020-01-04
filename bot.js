const token = process.env.TOKEN;

const Bot = require("node-telegram-bot-api");
let bot;
const request = require("request");

if (process.env.NODE_ENV === "production") {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, {
    polling: true
  });
}

console.log("Bot server started in the " + process.env.NODE_ENV + " mode");

bot.onText(/\/start/, function (msg, match) {
  const chatId = msg.chat.id;
  var resp = match[1];
  bot.sendMessage(
    chatId,
    "\nPress <b>/fastKeyboard</b>\n  ", {
      parse_mode: "HTML"
    }
  );
});

//Movie searcher
bot.onText(/\/movie (.+)/, function (msg, match) {
  const movie = match[1];
  const chatId = msg.chat.id;
  request(`http://www.omdbapi.com/?apikey=1e7240b&t=${movie}`, function (
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      bot
        .sendMessage(
          chatId,
          "_Looking for _" + movie + ", Mr." + msg.from.first_name + "...", {
            parse_mode: "Markdown"
          }
        )
        .then(function (msg) {
          const res = JSON.parse(body);
          bot.sendPhoto(chatId, res.Poster, {
            caption: "Result: \nTitle: " +
              res.Title +
              "\nYear: " +
              res.Year +
              "\nRated: " +
              res.Rated +
              "\nReleased: " +
              res.Released +
              "\nRuntime: " +
              res.Runtime +
              "\nGenre: " +
              res.Genre +
              "\nCountry: " +
              res.Country
          });
        });
    }
  });
});

// bot.onText(/\/weather (.+)/, function (msg, match) {
//     const weather = match[1]; //second word after command
//     const chatId = msg.chat.id;

//     request('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store', function (error, response, body) {
//         if (!error && response.statusCode == 200) {}
//         var res = JSON.parse(body);
//     })
// })

//
bot.onText(/\/fastKeyboard/, msg => {
  bot.sendMessage(
    msg.chat.id,
    "Here is your super-fast keyboard Mr." + msg.from.first_name, {
      reply_markup: {
        keyboard: [
          ["Currency", "Weather"],
          ["Cool", "More options"],
          ["I'm robot"]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true
      }
    }
  );
  // bot.sendMessage(msg.chat.id, "Choose the currency", {
  //   reply_markup: {
  //     inline_keyboard: [
  //       [{
  //           text: "USD",
  //           callback_data: "USD"
  //         },
  //         {
  //           text: "EUR",
  //           callback_data: "EUR"
  //         },
  //         {
  //           text: "RUB",
  //           callback_data: "RUB"
  //         },
  //         {
  //           text: "SEK",
  //           callback_data: "SEK"
  //         }
  //       ]
  //     ]
  //   }
  // });
});

bot.onText(/\/help/, function (msg, match) {
  const chatId = msg.chat.id; // Получаем ID отправителя
  var resp = match[1]; // Получаем текст после /echo
  bot.sendMessage(
    chatId,
    "<i>This is Maxim Saffarini's Telegram Bot that shows weather🌦, currency rate 💵 etc.</i> \n\n<b>List of commands: </b>" +
    "\n/weather - Weather forecast" +
    "\n/currency - Today's currency rate " +
    "\n/movie - After this command just write the name of the movie" +
    "\n/help - Helpful list of commands" +
    "\n/settings - Available changes " +
    "\n\n<b>OR</b>\n\n Just type <b>/</b> ", {
      parse_mode: "HTML"
    }
  );
});

bot.onText(/\/settings/, function (msg, match) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Available changes that you can apply: ");
});

bot.on("message", msg => {
  const Hi = ["hi"];
  if (
    msg.text.toString().toLowerCase().indexOf(Hi) === 0
  ) {
    bot.sendMessage(
      msg.chat.id,
      "Hello, " + msg.from.first_name + " " + msg.from.last_name + "!"
    );
  }
  const Bye = "bye";
  if (
    msg.text.toString().toLowerCase().includes(Bye)
  ) {
    bot.sendMessage(msg.chat.id, "Hope to see you around again , adiós 👋");
  }

  const you = "Who are you?";
  if (msg.text.toString().toLowerCase().indexOf(you) === 0) {
    bot.sendMessage(msg.chat.id, " <b>Yes I'm robot but not in that way!</b>", {
      parse_mode: "HTML"
    });
  }
});

module.exports = bot;