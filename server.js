require("dotenv").config();
const connectDB = require("./db");
const { Telegraf, Scenes, session } = require("telegraf");
const addLeisureScene = require("./scenes/addNewLeisure");
const getWeather = require("./getWeather");
const getLeisureScene = require("./scenes/getLeisure");

const bot = new Telegraf(process.env.BOT_API_KEY);

connectDB();

bot.use(session());

const stage = new Scenes.Stage([addLeisureScene, getLeisureScene], {
  ttl: 10, // время жизни сцены в минутах
});

bot.use(stage.middleware());

bot.start((ctx) => {
  return ctx.reply(`Привет, чем займемся сегодня?


    /addnewleisure - добавить развлечение
    /getleisure - узнать развлечение на день
    /getweather - узнать погоду`);
});

bot.command("getweather", async (ctx) => {
  try {
    const weatherData = await getWeather();
    const message = `Сегодня ${weatherData.description.toLowerCase()}.
  🌡 Температура ${weatherData.temp}°C.
  🌧 Вероятность дождя: ${weatherData.chanceOfRain} `;
    return ctx.reply(message);
  } catch (err) {
    console.log(err);
    await ctx.reply("Не удалось получить данные о погоде. Попробуйте позже.");
  }
});

bot.command("addnewleisure", (ctx) => ctx.scene.enter("ADD_LEISURE"));
bot.command("getleisure", (ctx) => ctx.scene.enter("GET_LEISURE"));

bot
  .launch()
  .then(() => console.log("Бот запущен и готов к работе!"))
  .catch((err) => console.error("Ошибка запуска:", err));
