const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const axios = require("axios");
const { ApiErrors } = require("./ApiErrors");
const apiURL = `${PTEORDACTYL_URL}/api/application`;

const createPteroUser = async (
  email,
  firstName,
  lastName,
  username,
  discordId = null
) => {
  try {
    const userData = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
    };
    if (discordId) {
      userData.discord_id = discordId;
    }
    const pteroUser = await axios.post(`${apiURL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    
    return [pteroUser.data.attributes, null];
  } catch (error) {
    console.error(error.message);
    return [null, error];
  }
};

const deletePteroUser = async (userId) => {
  try {
    await axios.delete(`${apiURL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const getPteroUser = async (userId) => {
  try {
    const pteroUser = await axios.get(`${apiURL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [pteroUser.data.attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const updatePteroUser = async (userId, body) => {
  const { email, username, first_name, last_name, password } = body;

  try {
    if (
      [email, username, first_name, last_name, password].includes(undefined)
    ) {
      throw new ApiErrors(400, "All fields are required");
    }
    const pteroRes = await axios.patch(`${apiURL}/users/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [pteroRes.data.attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const getAllPteroUsers = async () => {
  try {
    const pteroRes = await axios.get(`${apiURL}/users`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [pteroRes.data.attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const getServersOfUser = async (userId) => {
  try {
    const pteroRes = await axios.get(
      `${apiURL}/users/${userId}?include=servers`,
      {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return [pteroRes.data.attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const getPteroUserByEmail = async (email) => {
  try {
    const pteroRes = await axios.get(`${apiURL}/users?filter[email]=${email}`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [pteroRes.data[0].attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

module.exports = {
  createPteroUser,
  deletePteroUser,
  getPteroUser,
  updatePteroUser,
  getAllPteroUsers,
  getServersOfUser,
  getPteroUserByEmail,
};
