const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 15,
    },
    slug: {
      type: String,
      required: true,
      min: 15,
    },
    content: {
      type: String,
      required: true,
      min: 10,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: false,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
