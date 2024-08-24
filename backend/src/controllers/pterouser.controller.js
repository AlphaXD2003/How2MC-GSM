const { ApiErrors } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const {
  getPteroUser: gPuser,
  deletePteroUser: delPUser,
  createPteroUser: cPuser,
  updatePteroUser: uPuser,
  getAllPteroUsers: gAllUsers,
  getServersOfUser: gServerOfUser,
  getPteroUserByEmail: gUserByEmail,
} = require("../utils/PteroUser");

const getPteroUser = async (req, res) => {
  const { pteroUserID } = req.body;
  try {
    const [pteroUser, pteroError] = await gPuser(pteroUserID);
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const deletePteroUser = async (req, res) => {
  const { pteroUserID } = req.body;
  try {
    await delPUser(pteroUserID);
    return res
      .status(200)
      .json(new ApiResponse(200, true, "Pterodactyl user deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const createPteroUser = async (req, res) => {
  const { email, firstName, lastName, username } = req.body;
  try {
    const [pteroUser, pteroError] = await cPuser(
      email,
      firstName,
      lastName,
      username
    );
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not created");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user created"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const updatePteroUser = async (req, res) => {
  const { pteroUserID, body } = req.body;
  try {
    const [pteroUser, pteroError] = await uPuser(pteroUserID, body);
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not updated");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user updated"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [pteroUsers, pteroError] = await gAllUsers();
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl users not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUsers, "Pterodactyl users found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getServerOfUsers = async (req, res) => {
  const { pteroUserID } = req.body;
  try {
    const [pteroUser, pteroError] = await gServerOfUser(pteroUserID);
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [pteroUser, pteroError] = await gUserByEmail(email);
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

module.exports = {
  getPteroUser,
  deletePteroUser,
  createPteroUser,
  updatePteroUser,
  getAllUsers,
  getServerOfUsers,
  getUserByEmail
};
