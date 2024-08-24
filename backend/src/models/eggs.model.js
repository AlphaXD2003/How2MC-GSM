const { Types, Schema, model } = require("mongoose");

const EgsSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  servers: {
    type: [Number],
   
  },
  parentNest: {
    type: [Number],
 
  },
  url: {
    type: String,
    default: "",
  },
});

const Egg = model("Egg", EgsSchema);
module.exports = Egg;
