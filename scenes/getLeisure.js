const { Scenes, Markup } = require("telegraf");
const Leisures = require("../model");

const getLeisureScene = new Scenes.WizardScene(
  "GET_LEISURE",
  async (ctx) => {
    try {
      const count = await Leisures.countDocuments();
      const randomLeisure = await Leisures.findOne().skip(
        Math.floor(Math.random() * count)
      );
      await ctx.reply(
        randomLeisure.leisure,
        Markup.inlineKeyboard([
          Markup.button.callback(
            "Выбрать другое занятие",
            JSON.stringify({ type: "another" })
          ),
          Markup.button.callback(
            "Ок",
            JSON.stringify({ type: "ok", id: randomLeisure._id })
          ),
        ])
      );
      return ctx.wizard.next();
    } catch (err) {
      console.error(err);
      await ctx.reply("Произошла ошибка, попробуйте позже.");
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const data = JSON.parse(ctx.callbackQuery?.data);

    if (data.type === "another") {
      await ctx.answerCbQuery();
      return ctx.scene.enter("GET_LEISURE");
    } else if (data.type === "ok") {
      await ctx.answerCbQuery();
      await Leisures.deleteOne({ _id: data.id });
      await ctx.reply("Приятного отдыха");
      return ctx.scene.leave();
    } else {
      return ctx.wizard.back();
    }
  }
);

module.exports = getLeisureScene;
