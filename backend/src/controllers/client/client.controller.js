const { axios } = require("axios");
const { ApiResponse } = require("../../utils/ApiResponse");
const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const apiURL = `${PTEORDACTYL_URL}/api/client`;
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const listServers = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}?include=egg,subusers`,
      {},
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Servers fetched"));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal server error"
        )
      );
  }
};
const showAllPermissions = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}/permissions`,
      {},
      {
        headers,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Permissions fetched"));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal server error"
        )
      );
  }
};

module.exports = {
  listServers,
  showAllPermissions
};
