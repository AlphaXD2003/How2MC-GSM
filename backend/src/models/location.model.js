const { Schema, model, Types } = require("mongoose");

const LocationSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  short: {
    type: String,
    required: true,
    unique: true,
  },
  long: {
    type: String,
    required: true,
    unique: true,
  },

  nodes: {
    type: [Number],
    unique: true,
  },

});
const Location = model("Location", LocationSchema);
module.exports = Location;
