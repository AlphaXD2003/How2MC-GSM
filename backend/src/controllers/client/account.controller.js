const axios  = require("axios");
const { ApiResponse } = require("../../utils/ApiResponse");
const { PTEORDACTYL_URL, PTEORDACTYL_CKEY } = process.env;
const apiURL = `${PTEORDACTYL_URL}/api/client/account`;
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_CKEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const getAdminAccount = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}`,
     
      {
        headers,
      }
    );
   
    const data = pteroRes.data;
  
  

    res
      .status(200)
      .json(new ApiResponse(200, data.attributes, "Account fetched"));
  } catch (error) {
    console.error(error);
    //console.log(error.response.data);
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
}

const getAccount = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}`,
      {},
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Account fetched"));
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

const get2FA = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}/two-factor`,
      {},
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "2FA fetched"));
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

const enable2FA = async (req, res) => {
  const { code, password } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/two-factor`,
      {
        code,
        password,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "2FA enabled"));
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

const disable2FA = async (req, res) => {
  const { password } = req.body;
  try {
    await axios.delete(
      `${apiURL}/two-factor`,
      {
        password,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "2FA disabled"));
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

const updateEmail = async (req, res) => {
  const { email, password } = req.body;
  try {
    await axios.post(
      `${apiURL}/update/email`,
      {
        email,
        password,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Email updated"));
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

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    await axios.post(
      `${apiURL}/update/password`,
      {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Password updated"));
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

const getAPIKey = async (req, res) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}/api-key`,
      {},
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "API Key fetched"));
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

const createAPIKey = async (req, res) => {
  const { description = "", allowed_ips = [] } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/api-key`,
      {
        description,
        allowed_ips,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "API Key created"));
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

const deleteAPIKey = async (req, res) => {
  const keyId = req.params.id;
  try {
    await axios.delete(
      `${apiURL}/api-key/${keyId}`,
      {},
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "API Key deleted"));
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
    getAccount,
    get2FA,
    enable2FA,
    disable2FA,
    updateEmail,
    updatePassword,
    getAPIKey,
    createAPIKey,
    deleteAPIKey ,
    getAdminAccount
};
