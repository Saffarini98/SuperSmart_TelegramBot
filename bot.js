const token = process.env.TOKEN;
const Bot = require("node-telegram-bot-api");
let bot;
const request = require("request");
const MovieSearcher = require("./lib/MovieSearcher");
const WeatherSearcher = require("./lib/WeatherForecast");

if (process.env.NODE_ENV === "production") {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, {
    polling: true
  });
}

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

  MovieSearcher.findMovie(movie)
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

bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Choose the city", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Moscow",
            callback_data: "Moscow"
          },
          {
            text: "STHLM",
            callback_data: "Stockholm"
          },
          {
            text: "Dubai",
            callback_data: "Dubai"
          },
          {
            text: "Alanya",
            callback_data: "Alanya"
          }
        ]
      ]
    }
  });
});
//https://thehooraymedia.com/telegram-bot-the-new-ui/
bot.on("callback_query", async callbackQuery => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  // const { id } = message.chat;

  const result = await WeatherSearcher.getWeatherByCity(callbackQuery.data)
    .then(weatherCity => {
      return weatherCity;
    })
    .catch(err => {
      console.log(err);
    });
  const { name, main, temp } = result;
  bot.sendMessage(chatId, `Weather in ${name}: ${main}, ${temp}°C`);
});

bot.onText(/\/KeyboardMarkup/, msg => {
  bot.sendMessage(
    msg.chat.id,
    "Here is your super-fast keyboard Mr." + msg.from.first_name,
    {
      reply_markup: {
        keyboard: [
          ["/currency", "/weather"],
          ["Cool", "More options"],
          ["I'm robot"]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true
      }
    }
  );
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
