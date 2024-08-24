const axios = require("axios");
const { ApiResponse } = require("../utils/ApiResponse");
const apiUrl = `${process.env.PTEORDACTYL_URL}/api/application/locations`;
const { PTEORDACTYL_KEY } = process.env;
const { Location, Node } = require('../models/');
const LocationNodesModel = require("../models/locationNodes");
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const getSyncedLocations = async (req, res) => {
  try {
    const locationNode = await LocationNodesModel.find();
    res
    .status(201)
    .json(
      new ApiResponse(200, locationNode)
    )
  } catch (error) {
    res
    .status(error.statusCode || 401)
    .json(
      new ApiResponse(error.statusCode || 401, "Location Node Data cannot be found")
    )
  }
}


// In this below method I am going to assume that the location in the node itself

const syncLocationsWithNodes = async (req, res) => {

  try {
    const locationResponse = await axios.get(`${apiUrl}?include=nodes`, { headers })
    // //console.log(locationResponse.data.data)
    const response = locationResponse.data.data;
    for (const res of response) {
      let numberOfServers = [];
      const data = res.attributes;
      let totalRAM = 0;
      let totalDISK = 0;
      let totalUsedRAM = 0;
      let totalUsedDISK = 0;
      let isInMaintenance = true;
      for (const node of data.relationships.nodes.data) {
        const nodeData = node.attributes;
        if(!nodeData) break;
        const nd = await Node.findOne({id: nodeData.id})
        // //console.log(nd.servers)
        nd.servers.map(server => {
          numberOfServers.push(server)
        })
        // numberOfServers.push(nd.servers);
        totalRAM += nodeData.memory;
        totalDISK += nodeData.disk;
        totalUsedRAM += nodeData.allocated_resources.memory;
        totalUsedDISK += nodeData.allocated_resources.disk;
        if (!nodeData.maintenance_mode) {
          isInMaintenance = false
        }
      }
      const locationNodeData = await LocationNodesModel.findOne({
        l_id: data.id
      })
      
    
      if (locationNodeData) {
        locationNodeData.resources = {
          allocatedRam: totalRAM,
            allocatedDisk: totalDISK,
            usedRam: totalUsedRAM,
            usedDisk: totalUsedDISK,
            isInMaintenance,
            numberOfServers
        }
        await locationNodeData.save();
      } else {
        await LocationNodesModel.create({
          l_id: data.id,
          resources: {
            allocatedRam: totalRAM,
            allocatedDisk: totalDISK,
            usedRam: totalUsedRAM,
            usedDisk: totalUsedDISK,
            isInMaintenance,
            numberOfServers
          }
        })
      }




    }

    res
      .status(200)
      .json(new ApiResponse(200, locationResponse.data.data))
  } catch (error) {
    //console.log(error.message)
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
}


const listLocations = async (req, res) => {
  try {
    const locations = await Location.find({});
    res.status(200).json(new ApiResponse(200, locations));

  } catch (error) {
    console.error(error?.message);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
}

const getAllLocations = async (req, res) => {
  try {
    const locationsRes = await axios.get(apiUrl, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, locationsRes.data));
  } catch (error) {
    console.error(error.message);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const getLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const locationRes = await axios.get(`${apiUrl}/${id}`, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, locationRes.data));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const getNodesOfLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const locationRes = await axios.get(`${apiUrl}/${id}?include=nodes`, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, locationRes.data));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const createLocation = async (req, res) => {
  const { name, short, long } = req.body;
  try {
    const locationRes = await axios.post(
      apiUrl,
      { name, short, long },
      {
        headers,
      }
    );
    // Insert into database
    await Location.create({
      id: locationRes.data.attributes.id,
      short: locationRes.data.attributes.short,
      long: locationRes.data.attributes.long,
    })

    res.status(201).json(new ApiResponse(201, locationRes.data));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, short, long } = req.body;
  try {
    const locationRes = await axios.put(
      `${apiUrl}/${id}`,
      { name, short, long },
      {
        headers,
      }
    );
    // Update in database
    await Location.findOneAndUpdate(
      { id },
      { short, long },
      { new: true }
    );
    res.status(200).json(new ApiResponse(200, locationRes.data));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};
const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${apiUrl}/${id}`, {
      headers,
    });
    // Delete from database
    await Location.findOneAndDelete({ id });
    res
      .status(200)
      .json(new ApiResponse(200, true, "Location deleted successfully"));
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          error.message || "Internal server error"
        )
      );
  }
};

module.exports = {
  listLocations,
  getAllLocations,
  getLocation,
  getNodesOfLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  syncLocationsWithNodes,
  getSyncedLocations
};
