const axios = require("axios");
const { ApiResponse } = require("../../utils/ApiResponse");
const { Server } = require("../../models");
const { PTEORDACTYL_URL, PTEORDACTYL_KEY, PTEORDACTYL_CKEY } = process.env;
const apiURL = `${PTEORDACTYL_URL}/api/client/servers`;
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_CKEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const serverDetails = async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}?include=egg,subusers`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data.attributes, "Server details fetched")
      );
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

const webSocketDetails = async (req, res) => {
  const { id } = req.params;
 

  try {
    const pteroRes = await axios.get(`${apiURL}/${id}/websocket`, {
      headers: {
        Authorization: `Bearer ${process.env.PTEORDACTYL_CKEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data.data, "Websocket details fetched")
      );
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
};

const resourceUsage = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/resources`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data.attributes, "Resource usage fetched")
      );
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

const sendCommand = async (req, res) => {
  const { id } = req.params;
  const { command } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/command`,
      {
        command,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Command sent"));
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

const sendPowerAction = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/power`,
      {
        signal: action,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Power action sent"));
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

const listServerDatabases = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/databases?include=password`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server databases fetched"));
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

const createServerDatabases = async (req, res) => {
  const { id } = req.params;
  const { database, remote = "%" } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/databases`,
      {
        database,
        remote,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Database created"));
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
};

const rotateServerDatabasePassword = async (req, res) => {
  const { id, database_id } = req.params;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/databases/${database_id}/rotate-password`,
{},
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Database password rotated"));
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
};

const deleteServerDatabase = async (req, res) => {
  const { id, database_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/databases/${database_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Database deleted"));
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

const listServerVariables = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/startup`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server variables fetched"));
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

const updateServerVariables = async (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/startup/variables`,
      {
        key,
        value,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server variables updated"));
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

const renameServer = async (req, res) => {
  const { id } = req.params;
  const { name, description,aid } = req.body;
  
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/settings/rename`,
      {
        
        name,
        description,
      },
      {
        headers,
      }
    );
    await Server.updateOne(
      {"server_id" : aid},
      {
        server_name: name,
        server_description: description,
      }
    )
    res.status(200).json(new ApiResponse(200, pteroRes.data, "Server renamed"));
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

const reinstallServer = async (req, res) => {
  const { id } = req.params;
  try {
    await axios.post(
      `${apiURL}/${id}/settings/reinstall`,{},

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Server reinstalled"));
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

const listServerBackups = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/backups`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server backups fetched"));
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

const createBackup = async (req, res) => {
  const { id } = req.params;
  //console.log(req.body);
  try {
    const backUpRes = await axios.post(
      `${apiURL}/${id}/backups`,
      {
        name : req.body.name,
        ignored_files : req.body.ignored_files,
        locked : req.body.locked,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, backUpRes.data.attributes, "Backup created"));
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
};

const getBackupDetails = async (req, res) => {
  const { id, backup_id } = req.params;
  try {
    const backUpRes = await axios.get(
      `${apiURL}/${id}/backups/${backup_id}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          backUpRes.data.attributes,
          "Backup details fetched"
        )
      );
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

const downloadBackup = async (req, res) => {
  const { id, backup_id } = req.params;
  try {
    const backUpRes = await axios.get(
      `${apiURL}/${id}/backups/${backup_id}/download`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, backUpRes.data.attributes, "Backup downloaded")
      );
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
};

const deleteBackup = async (req, res) => {
  const { id, backup_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/backups/${backup_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Backup deleted"));
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

const listServerUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/users`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server users fetched"));
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

const createSubUser = async (req, res) => {
  const { id } = req.params;
  const { email, permissions } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/users`,
      {
        email,
        permissions,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Subuser created"));
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

const getSubUserDetails = async (req, res) => {
  const { id, subuser_id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/users/${subuser_id}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          pteroRes.data.attributes,
          "Subuser details fetched"
        )
      );
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

const updateSubUserDetails = async (req, res) => {
  const { id, subuser_id } = req.params;
  const { permissions } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/users/${subuser_id}`,
      {
        permissions,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Subuser details updated"));
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

const deleteSubUser = async (req, res) => {
  const { id, subuser_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/users/${subuser_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Subuser deleted"));
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

const listAllocation = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/network/allocations`,

      {
        headers,
      }
    );
    // //console.log(pteroRes.data);
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server allocations fetched"));
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

const assignAllocation = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/network/allocations`,
      {},
      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data.attributes, "Allocation assigned")
      );
  } catch (error) {
    console.error(error);
    console.log(error.response.data);
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

const setAllocationNote = async (req, res) => {
  const { id, allocation_id } = req.params;
  const { notes } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/network/allocations/${allocation_id}`,
      {
        notes,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data.attributes, "Allocation note set")
      );
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

const setPrimaryAllocation = async (req, res) => {
  const { id, allocation_id } = req.params;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/network/allocations/${allocation_id}/primary`,
      {},

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, true, "Primary allocation set")
      );
  } catch (error) {
    console.error(error.data.errors);
    
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

const deleteAllocation = async (req, res) => {
  const { id, allocation_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/network/allocations/${allocation_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Allocation deleted"));
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

const listSchedules = async (req, res) => {
  const { id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/schedules`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server schedules fetched"));
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

const createSchedule = async (req, res) => {
  const { id } = req.params;
  const { name, is_active, minute, hour, day_of_week, day_of_month } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/schedules`,
      {
        name,
        is_active,
        minute,
        hour,
        day_of_week,
        day_of_month,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Schedule created"));
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

const getScheduleDetails = async (req, res) => {
  const { id, schedule_id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/schedules/${schedule_id}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          pteroRes.data.attributes,
          "Schedule details fetched"
        )
      );
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

const updateSchedule = async (req, res) => {
  const { id, schedule_id } = req.params;
  const { name, is_active, minute, hour, day_of_week, day_of_month } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/schedules/${schedule_id}`,
      {
        name,
        is_active,
        minute,
        hour,
        day_of_week,
        day_of_month,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Schedule updated"));
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

const deleteSchedule = async (req, res) => {
  const { id, schedule_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/schedules/${schedule_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Schedule deleted"));
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

const createTask = async (req, res) => {
  const { id, schedule_id } = req.params;
  const { action, time_offset, payload } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/schedules/${schedule_id}/tasks`,
      {
        action,
        time_offset,
        payload,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "Task created"));
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

const updateTask = async (req, res) => {
  const { id, schedule_id, task_id } = req.params;
  const { action, time_offset, payload } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/schedules/${schedule_id}/tasks/${task_id}`,
      {
        action,
        time_offset,
        payload,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "Task updated"));
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

const deleteTask = async (req, res) => {
  const { id, schedule_id, task_id } = req.params;
  try {
    await axios.delete(
      `${apiURL}/${id}/schedules/${schedule_id}/tasks/${task_id}`,

      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "Task deleted"));
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

const listFiles = async (req, res) => {
  const { id } = req.params;
  const { directory = "/" } = req.query;
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/files/list?directory=%2F${directory}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server files fetched"));
  } catch (error) {
    console.error(error);
    console.error(error.response.data);
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

const getContentsOfFile = async (req, res) => {
  const { id } = req.params;
  const {file} = req.body
  //console.log(file);
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/files/contents?file=${file}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, pteroRes.data, "File contents fetched")
      );
  } catch (error) {
    // console.error(error);
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
};

const downloadFile = async (req, res) => {
  const { id } = req.params;
  const { file } = req.body;
  //console.log(file);  
  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/files/download?file=${file}`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data.attributes, "File downloaded"));
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

const moveFiles = async (req, res) => {
  const { id, } = req.params;
  const { root = `/`, files = [] } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/files/rename`,
      {
        root,
        files
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "File renamed"));
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
};
const renameFile = async (req, res) => {
  const { id, } = req.params;
  const { root = `/`, from, to } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/files/rename`,
      {
        root,
        files: [
          {
            from,
            to,
          },
        ],
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "File renamed"));
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
};

const copyFile = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  try {
    const pteroRes = await axios.put(
      `${apiURL}/${id}/files/copy`,
      {
        location,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "File copied"));
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

const writeFile = async (req, res) => {
  const { id } = req.params;
  const { file, content } = req.body;
  //console.log(file);
  //console.log(content);
  let acctualContent =  content.replace(/^"(.*)"$/, '$1');

  try {
    await axios.post(
      `${apiURL}/${id}/files/write?file=${encodeURIComponent(file)}`,
      acctualContent,
      {
        headers:{
          ...headers,
          "Content-Type": "text/plain",
        },
      }
    );
    res.status(200).json(new ApiResponse(200, true, "File written"));
  } catch (error) {
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
};

const compressFile = async (req, res) => {
  const { id } = req.params;
  const { files = [], root = "/" } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/files/compress`,
      {
        files,
        root,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Files compressed"));
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

const decompressFile = async (req, res) => {
  const { id } = req.params;
  const { file, root = "/" } = req.body;
  //console.log(file);
  //console.log(root);
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/files/decompress`,
      {
        file,
        root,
      },
      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "File decompressed"));
  } catch (error) {
    // console.error(error);
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
};

const deleteFile = async (req, res) => {
  const { id } = req.params;
  const { files = [] , root } = req.body;
  //console.log(files);
  //console.log(root);
  try {
    await axios.post(
      `${apiURL}/${id}/files/delete`,
      {
        root,
        files,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, true, "File deleted"));
  } catch (error) {
    // console.error(error);
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
};

const createFolder = async (req, res) => {
  const { id } = req.params;
  const { name, root = "/" } = req.body;
  try {
    const pteroRes = await axios.post(
      `${apiURL}/${id}/files/create-folder`,
      {
        name,
        root,
      },
      {
        headers,
      }
    );
    res.status(200).json(new ApiResponse(200, pteroRes.data, "Folder created"));
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

const uploadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const pteroRes = await axios.get(
      `${apiURL}/${id}/files/upload`,

      {
        headers,
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data.attributes, "File uploaded"));
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
  serverDetails,
  webSocketDetails,
  resourceUsage,
  sendCommand,
  sendPowerAction,
  listServerDatabases,
  createServerDatabases,
  rotateServerDatabasePassword,
  deleteServerDatabase,
  listServerVariables,
  updateServerVariables,
  renameServer,
  reinstallServer,
  listServerBackups,
  createBackup,
  getBackupDetails,
  downloadBackup,
  deleteBackup,
  listServerUsers,
  createSubUser,
  getSubUserDetails,
  updateSubUserDetails,
  deleteSubUser,
  listAllocation,
  assignAllocation,
  setAllocationNote,
  setPrimaryAllocation,
  deleteAllocation,
  listSchedules,
  createSchedule,
  getScheduleDetails,
  updateSchedule,
  deleteSchedule,
  createTask,
  updateTask,
  deleteTask,
  listFiles,
  getContentsOfFile,
  downloadFile,
  renameFile,
  copyFile,
  writeFile,
  compressFile,
  decompressFile,
  deleteFile,
  createFolder,
  uploadFile,
  moveFiles
};
