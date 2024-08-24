const  axios  = require("axios");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiErrors } = require("../utils/ApiErrors");
const { trusted } = require("mongoose");
const apiUrl = `${process.env.PTEORDACTYL_URL}/api/application/nodes`;
const { PTEORDACTYL_KEY } = process.env;
const { Node } = require("../models/");
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const getNode = async(req, res) => {
  try {
    const nodes = await Node.findOne({id : req.params.id});
    res
    .status(201)
    .json(
      new ApiResponse(
        201, nodes
      )
    )
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
}

const listNodes = async (req, res) => {
  try {
    const nodesRes = await axios.get(apiUrl, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, nodesRes.data));
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

const listServerOFNodes = async (req, res) => {
  const { id } = req.params;
  try {
    const nodesRes = await axios.get(`${apiUrl}/${id}?include=servers`, {
      headers,
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          nodesRes.data.attributes.relationships.servers.data
        )
      );
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

const getNodeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const nodesRes = await axios.get(`${apiUrl}/${id}`, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, nodesRes.data));
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

const getNodeConfiguration = async (req, res) => {
  const { id } = req.params;
  try {
    const nodesRes = await axios.get(`${apiUrl}/${id}/configuration`, {
      headers,
    });
    res.status(200).json(new ApiResponse(200, nodesRes));
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

const createNode = async (req, res) => {
  const {
    name,
    location_id,
    fqdn,
    scheme = "https",
    memory,
    memory_overallocate = 0,
    disk,
    disk_overallocate = 0,
    upload_size = 100,
    daemon_listen = 8080,
    daemon_sftp = 2022,
    daemon_base = "/var/lib/pterodactyl/volumes",
    daemon_ssl,
    daemon_ssl_cert,
    daemon_ssl_key,
    behind_proxy = false,
    description = "I am a node",
  } = req.body;
  try {
    if (
      [
        name,
        location_id,
        fqdn,
        scheme,
        memory,
        memory_overallocate,
        disk,
        disk_overallocate,
        upload_size,
      ].includes(undefined)
    ) {
      throw new ApiErrors(400, "Missing required fields");
    }
    if (scheme !== "http" && scheme !== "https") {
      throw new ApiErrors(400, "Invalid scheme");
    }
    if (scheme === "https") {
      const ipPattern = new RegExp(
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
      );
      if (ipPattern.test(fqdn)) {
        throw new ApiErrors(
          400,
          "FQDN cannot be an IP address when scheme is https"
        );
      }
    }
    const nodeData = {
      name,
      location_id,
      fqdn,
      scheme,
      memory,
      memory_overallocate,
      disk,
      disk_overallocate,
      upload_size,
      daemon_listen,
      daemon_sftp,
      daemon_base,
      daemon_ssl,
      daemon_ssl_cert,
      daemon_ssl_key,
      behind_proxy,
      description,
    };

    const nodeRes = await axios.post(apiUrl, nodeData, {
      headers,
    });
    // Save node to database
    await Node.create({
      id: nodeRes.data.attributes.id,
      uuid: nodeRes.data.attributes.uuid,
      name: nodeRes.data.attributes.name,
      description: nodeRes.data.attributes.description,
      location: nodeRes.data.attributes.location_id,
      isPublic: nodeRes.data.attributes.public,
      fqdn: nodeRes.data.attributes.fqdn,
      scheme: nodeRes.data.attributes.scheme,
      behindProxy: nodeRes.data.attributes.behind_proxy,
      maintenanceMode: nodeRes.data.attributes.maintenance_mode,
      memory: nodeRes.data.attributes.memory,
      memoryOverallocate: nodeRes.data.attributes.memory_overallocate,
      disk: nodeRes.data.attributes.disk,
      diskOverallocate: nodeRes.data.attributes.disk_overallocate,
      uploadSize: nodeRes.data.attributes.upload_size,
      daemonBase: nodeRes.data.attributes.daemon_base,
      daemonListen: nodeRes.data.attributes.daemon_listen,
      daemonSFTPPort: nodeRes.data.attributes.daemon_sftp,
    })
    return res.status(201).json(new ApiResponse(201, nodeRes.data.attributes));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const updateNode = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    location_id,
    fqdn,
    scheme = "https",
    memory,
    memory_overallocate,
    disk,
    disk_overallocate,
    upload_size,
    daemon_listen = 8080,
    daemon_sftp = 2022,
    daemon_base = "/var/lib/pterodactyl/volumes",

    behind_proxy = false,
    description = "I am a node",
    maintenance_mode = false,
  } = req.body;
  try {
    if (
      [
        name,
        location_id,
        fqdn,
        scheme,
        memory,
        memory_overallocate,
        disk,
        disk_overallocate,
        upload_size,
      ].includes(undefined)
    ) {
      throw new ApiErrors(400, "Missing required fields");
    }
    if (scheme !== "http" || scheme !== "https") {
      throw new ApiErrors(400, "Invalid scheme");
    }
    if (scheme === "https") {
      const ipPattern = new RegExp(
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
      );
      if (ipPattern.test(fqdn)) {
        throw new ApiErrors(
          400,
          "FQDN cannot be an IP address when scheme is https"
        );
      }
    }
    const nodeData = {
      name,
      location_id,
      fqdn,
      scheme,
      memory,
      memory_overallocate,
      disk,
      disk_overallocate,
      upload_size,
      daemon_listen,
      daemon_sftp,
      daemon_base,
      daemon_ssl,
      daemon_ssl_cert,
      daemon_ssl_key,
      behind_proxy,
      description,
    };

    const nodeRes = await axios.patch(`${apiUrl}/${id}`, nodeData, {
      headers,
    });
    // Save node to database
    await Node.findOneAndUpdate(
      {id},
      {
        id: nodeRes.data.attributes.id,
        uuid: nodeRes.data.attributes.uuid,
        name: nodeRes.data.attributes.name,
        description: nodeRes.data.attributes.description,
        location: nodeRes.data.attributes.location_id,
        isPublic: nodeRes.data.attributes.public,
        fqdn: nodeRes.data.attributes.fqdn,
        scheme: nodeRes.data.attributes.scheme,
        behindProxy: nodeRes.data.attributes.behind_proxy,
        maintenanceMode: nodeRes.data.attributes.maintenance_mode,
        memory: nodeRes.data.attributes.memory,
        memoryOverallocate: nodeRes.data.attributes.memory_overallocate,
        disk: nodeRes.data.attributes.disk,
        diskOverallocate: nodeRes.data.attributes.disk_overallocate,
        uploadSize: nodeRes.data.attributes.upload_size,
        daemonBase: nodeRes.data.attributes.daemon_base,
        daemonListen: nodeRes.data.attributes.daemon_listen,
        daemonSFTPPort: nodeRes.data.attributes.daemon_sftp,
      },
      {new: true}
    );
    return res.status(201).json(new ApiResponse(201, nodeRes.data.attributes));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const deleteNode = async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${apiUrl}/${id}`, {
      headers,
    });
    // Delete node from database
    await Node.findOneAndDelete({id});
    return res.status(204).json(new ApiResponse(204, trusted, "Node deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getAllocation = async (req, res) => {
  const { id } = req.params;
  try {
    const allocationRes = await axios.get(`${apiUrl}/${id}/allocations`, {
      headers,
    });
    return res.status(200).json(new ApiResponse(200, allocationRes.data));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const createAllocation = async (req, res) => {
  const { id } = req.params;
  const { ip, alias, ports = [] } = req.body;
  try {
    if ([ip, alias].includes(undefined)) {
      throw new ApiErrors(400, "Missing required fields");
    }
    const allocationData = {
      ip,
      alias,
      ports,
    };
    await axios.post(`${apiUrl}/${id}/allocations`, {
      headers,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, true, "Allocation created"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const deleteAllocation = async (req, res) => {
  const { node_id, allocation_id } = req.params;
  try {
    await axios.delete(`${apiUrl}/${node_id}/allocations/${allocation_id}`, {
      headers,
    });
    return res
      .status(204)
      .json(new ApiResponse(204, true, "Allocation deleted"));
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
  deleteAllocation,
  getAllocation,
  deleteNode,
  listNodes,
  listServerOFNodes,
  getNodeDetails,
  getNodeConfiguration,
  createNode,
  updateNode,
  createAllocation,
  getNode,
};
