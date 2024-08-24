const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getPteroUser,
  createServer,
  getUser,
  getLimits,
  reloadJWT,
  getAllUsers,
  getUserInformationById,
  updateUser,
  updateTheImage
} = require("../controllers/user.controller");
const { verifyJWT, verifyAdminJWT } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

//create a router
const router = Router();

//nonsecured paths
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//secured paths
router.route("/get-user").post(verifyJWT,getUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/ptero-user-info").get(verifyJWT, getPteroUser);
router.route('/get-limits').get(verifyJWT, getLimits)
router.route('/reload-jwt').post( reloadJWT)
router.route('/get-all-users').get(verifyJWT, getAllUsers)
router.route('/get-user-info/:id').get(verifyJWT, getUserInformationById)
router.route('/update-user').post(verifyAdminJWT, updateUser)
router.route('/update-the-image').post(verifyJWT,upload.single('avatarImage'), updateTheImage)















/* router.route('/create-server').post(verifyJWT, createServer) */

module.exports = router;
