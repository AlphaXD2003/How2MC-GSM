const { Router } = require("express");

const router = Router();
const {
  createBlog,
  getAllBlogs,
  getBlogDetails,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blogs/blogs.controller");
const upload = require("../../middlewares/multer.middleware");

router.route("/").get(getAllBlogs);
router.route("/new").post(upload.single("coverImage"), createBlog);
router.route("/:slug").get(getBlogDetails);
router.route("/:slug").put(upload.single("coverImage"), updateBlog);
router.route("/:slug").delete(deleteBlog);

module.exports = router;
