const { Router } = require("express");
const {
  getPteroUser,
  deletePteroUser,
  updatePteroUser,
  createPteroUser,
  getAllUsers,
  getServerOfUsers,
  getUserByEmail
} = require("../controllers/pterouser.controller");

const router = Router();
router.route("/get-user/:id").get(getPteroUser);
router.route("/delete-user/:id").delete(deletePteroUser);
router.route("/update/:id").patch(updatePteroUser);
router.route("/create").post(createPteroUser);
router.route("/all-users").get(getAllUsers);
router.route("/server-of-user/:id").get(getServerOfUsers);
router.route("/user-by-email/:email").get(getUserByEmail)
module.exports = router;
