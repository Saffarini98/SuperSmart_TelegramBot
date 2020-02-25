const token = process.env.TOKEN;
const Bot = require("node-telegram-bot-api");
let bot;
const request = require("request");
var weather = require("./weather");
const MovieService = require("./lib/MovieSearcher");

if (process.env.NODE_ENV === "production") {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, {
    polling: true
  });
}

weather(bot);

console.log("Bot server started in the " + process.env.NODE_ENV + " mode");
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  var photo = "images/press.jpg";
  bot.sendPhoto(chatId, photo, {
    caption: "Press here to get the <b>/KeyboardMarkup</b>",
    parse_mode: "HTML"
  });
});

//Movie searcher
bot.onText(/\/movie (.+)/, (msg, match) => {
  const movie = match[1];
  const chatId = msg.chat.id;

  MovieService.findMovie(movie)
    .then(film => {
      bot.sendPhoto(chatId, film.Poster, {
        caption:
          "Result: \nTitle: " +
          film.Title +
          "\nYear: " +
          film.Year +
          "\nRated: " +
          film.Rated +
          "\nReleased: " +
          film.Released +
          "\nRuntime: " +
          film.Runtime +
          "\nGenre: " +
          film.Genre +
          "\nCountry: " +
          film.Country
      });
    })
    .catch(err => {
      console.log(err);
    });
});


bot.onText(/\/KeyboardMarkup/, msg => {
  bot.sendMessage(
    msg.chat.id,
    "Here is your super-fast keyboard Mr." + msg.from.first_name,
    {
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

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id; // Получаем ID отправителя
  bot.sendMessage(
    chatId,
    "<i>This is Maxim Saffarini's Telegram Bot that shows weather🌦, currency rate 💵 etc.</i> \n\n<b>List of commands: </b>" +
      "\n/weather - Weather forecast" +
      "\n/currency - Today's currency rate " +
      "\n/movie - After this command just write the name of the movie" +
      "\n/help - Helpful list of commands" +
      "\n/settings - Available changes " +
      "\n\n<b>OR</b>\n\n Just type <b>/</b> ",
    {
      parse_mode: "HTML"
    }
  );
});

bot.onText(/\/settings/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Available changes that you can apply: ");
});

bot.on("message", msg => {
  const Hi = ["hi"];
  if (
    msg.text
      .toString()
      .toLowerCase()
      .indexOf(Hi) === 0
  ) {
    bot.sendMessage(
      msg.chat.id,
      "Hello, " + msg.from.first_name + " " + msg.from.last_name + "!"
    );
  }
  const Bye = "bye";
  if (
    msg.text
      .toString()
      .toLowerCase()
      .includes(Bye)
  ) {
    bot.sendMessage(msg.chat.id, "Hope to see you around again , adiós 👋");
  }

  const you = "Who are you?";
  if (
    msg.text
      .toString()
      .toLowerCase()
      .indexOf(you) === 0
  ) {
    bot.sendMessage(msg.chat.id, " <b>Yes I'm robot but not in that way!</b>", {
      parse_mode: "HTML"
    });
  }
});

console.log(module);

module.exports = bot;
