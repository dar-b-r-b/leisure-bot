const { Scenes } = require("telegraf");
const Leisures = require("../model");

const addLeisureScene = new Scenes.WizardScene(
  "ADD_LEISURE",
  (ctx) => {
    ctx.reply("Введите развлечение");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.leisure = ctx.message.text;
    try {
      const newLeisure = new Leisures({
        leisure: ctx.wizard.state.leisure,
      });
      await newLeisure.save();
      ctx.reply("Готово!");
    } catch (err) {
      console.log("Ошибка:", err);
      ctx.reply("Ошибка сохранения!");
    }
    return ctx.scene.leave();
  }
);

module.exports = addLeisureScene;
