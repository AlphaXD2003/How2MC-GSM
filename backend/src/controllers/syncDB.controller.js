const { ApiErrors } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const { syncDBwithPtero } = require("../utils/SyncDBwithPtero");

const syncDB = async (req, res) => {
  try {
    const [syncRes, syncError] = await syncDBwithPtero();
    if (syncError) {
      throw new ApiErrors(500, "Error syncing database");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, syncRes, "Syncing database successful"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

module.exports = syncDB;