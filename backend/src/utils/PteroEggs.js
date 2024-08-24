const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const axios = require("axios");
const apiURL = `${PTEORDACTYL_URL}/api/application`;

const getPteroEgg = async (eggId, nestId) => {
  try {
    const eggInfo = await axios.get(
      `${apiURL}/nests/${nestId}/eggs/${eggId}?include=script,variables`,
      {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return [eggInfo.data.attributes, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const getServerOfEgg = async (eggId, nestId) => {
  try {
    const eggInfo = await axios.get(
      `${apiURL}/nests/${nestId}/eggs/${eggId}?include=servers`,
      {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return [eggInfo.data.attributes.relationships.servers.data, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

module.exports = {
  getPteroEgg,
  getServerOfEgg
};
