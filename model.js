const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  leisure: { type: String, required: true, unique: false },
});

module.exports = mongoose.model("Leisures", userSchema);
