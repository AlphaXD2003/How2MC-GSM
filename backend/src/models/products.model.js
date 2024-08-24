const { Types, Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
    required: true,
  },
  
  parentProductCategory: {
    type: Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  image:{
      type: String,
  },
  eggId:{
    type: [Number],
    required: true,

  },
  resources: {
    cpu: {
      type: Number,
      required: true,
    },
    ram: {
      type: Number,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
    },
    backup: {
      type: Number,
      required: true,
    },
    allocation: {
      type: Number,
      required: true,
    },
    database: {
      type: Number,
      required: true,
    },
  },
});

const Product = model("Product", ProductSchema);
module.exports = Product;
