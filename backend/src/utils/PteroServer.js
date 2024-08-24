const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const axios = require("axios");
const chalk = require("chalk");
const apiURL = `${PTEORDACTYL_URL}/api/application`;


const createPteroServer = async ({
  name,
  user,
  egg, // need it for the detecting which game it is
  docker_image = "quay.io/pterodactyl/core:java",
  startup,
  limits,
  environment,
  feature_limits,
  allocation,
  deploy,
  description
}) => {

  const body = {
    description,
    name,
    user,
    egg,
    docker_image,
    startup,
    limits,
    environment,
    feature_limits,
    allocation,
    deploy,
  };
  //console.log(chalk.bgGreen("Creating server with body: ", body));
  //console.log(body.feature_limits)
  //console.log(body.limits)
  Object.entries(body).forEach((value, key) => {
    //console.log(chalk.bgGreen(key, value));
  });
  try {
    const pteroServer = await axios
      .post(`${apiURL}/servers`, JSON.stringify(body), {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .catch((error) => {
        console.error(error.message);
      });
      //console.log(pteroServer.data)
    return [pteroServer, null];
  } catch (error) {
    console.error(chalk.bgRed("Error creating server: ", error.message));
    return [null, error];
  }
};

const updatePteroServer = async (serverId, body) => {
  try {
    const pteroResponse = await axios.patch(
      `${apiURL}/servers/${serverId}/build`,
      body,
      {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return [pteroResponse, null];
  } catch (error) {
    // console.error(error);
    // //console.log(error)
    console.log(error.response.data)
    return [null, error];
  }
};

const getServerDetails = async (serverId) => {
  try {
    const pteroServer = await axios.get(`${apiURL}/servers/${serverId}?include=allocation`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    //console.log(pteroServer.data)
    return [pteroServer.data.attributes, null];
  } catch (error) {
    //console.log(error)
    return [null, error];
  }
};

const deletePteroServer = async (serverId) => {
  try {
    await axios.delete(`${apiURL}/servers/${serverId}`, {
      headers: {
        Authorization: `Bearer ${PTEORDACTYL_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [true, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};



module.exports = {
  createPteroServer,
  updatePteroServer,
  getServerDetails,
  deletePteroServer,
};
