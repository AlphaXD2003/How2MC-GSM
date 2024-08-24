const { Blog } = require("../../models/index");
const {ApiErrors} = require("../../utils/ApiErrors");
const {ApiResponse} = require("../../utils/ApiResponse");
const { uploadOnCloudinary } = require("../../utils/cloudinary");
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.status(200).json({
      statusCode: 200,
      message: "Success getting all blogs",
      errors: null,
      data: blogs,
      success: true,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Error getting all blogs", error.errors)
      );
  }
};

const getBlogDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      throw new ApiErrors(404, "Blog not found",);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Success getting blog details", null));
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Error getting blog details", error.errors)
      );
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, slug, author } = req.body;
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      throw new ApiErrors(409, "Blog already exists", null, null);
    }
    if (!title || !content || !slug || !author) {
      throw new ApiErrors(400, "Invalid request", );
    }
    if (!req.file) {
      throw new ApiErrors(400, "No file provided", );
    }
    const blogCoverImagePath = req.file?.path;
    const blogCoverImage = await uploadOnCloudinary(blogCoverImagePath);
    if (!blogCoverImage) {
      throw new ApiErrors(500, "Error uploading image", );
    }
    const blog = new Blog({
      title,
      content,
      slug,
      author,
      coverImage: blogCoverImage.url,
    });

    await blog.save();
    return res
      .status(201)
      .json(new ApiResponse(201, blog, "Success creating blog", null));
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error creating blog", error.errors));
  }
};

const updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, author } = req.body;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      throw new ApiErrors(404, "Blog not found", );
    }
    if (!title || !content || !author) {
      throw new ApiErrors(400, "Invalid request", );
    }
    blog.title = title;
    blog.content = content;
    blog.author = author;

    if (req.file) {
      const blogCoverImagePath = req.file?.path;
      const blogCoverImage = await uploadOnCloudinary(blogCoverImagePath);
      if (!blogCoverImage) {
        throw new ApiErrors(500, "Error uploading image", );
      }
      blog.coverImage = blogCoverImage.url;
    }

    await blog.save();
    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Success updating blog", null));
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error updating blog", error.errors));
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      throw new ApiErrors(404, "Blog not found", );
    }
    await blog.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Success deleting blog", null));
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error deleting blog", error.errors));
  }
};

module.exports = {
  getAllBlogs,
  getBlogDetails,
  createBlog,
  updateBlog,
  deleteBlog,
};
