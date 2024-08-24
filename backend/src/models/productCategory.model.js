const { Types, Schema, model } = require("mongoose");

const ProductCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  nestId:{
    type: Number,
    required: true,
  }
});

const ProductCategory = model("ProductCategory", ProductCategorySchema);
module.exports = ProductCategory;