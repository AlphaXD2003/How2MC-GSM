const { ApiErrors } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const apiUrl = `${process.env.PTEORDACTYL_URL}/api/application/servers`;
const { PTEORDACTYL_KEY } = process.env;
const {
  updatePteroServer,
  getServerDetails: getServer,
  deletePteroServer: deleteServer,
  createPteroServer,
} = require("../utils/PteroServer");
const headers = {
  Authorization: `Bearer ${PTEORDACTYL_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};
const {Server, User, Egg} = require("../models/");
const axios = require("axios");

const getFreeServerOfUser = async (req, res) => {
    try {
      const userId = req.user.pteroId;
      const server = await Server.find({
        $and:[
          {
            "serverInfo.status": "free",
          },
          {
            user_id: userId,
          }
        ]
      })

      return res 
        .status(200)
        .json(new ApiResponse(200, server, "Server found"));
    } catch (error) {
      
      return res
        .status(error.statusCode || 500)
        .json(
          new ApiResponse(error.statusCode, error.data, error.message, error)
        );
    }
  }

const createServer = async (req, res) => {
  const {
    name,
    user,
    eggInfo, // need it for the detecting which game it is
    docker_image,
    startup,
    limits,
    environment,
    feature_limits,
    allocation,
    deploy,
    description = `${Date.now().toString()}`,
    cost,
    status
  } = req.body;
  try {
    if (
      [name, user, eggInfo, docker_image, startup, limits, environment].some(
        (value) => value === undefined || ""
      )
    ) {
      throw new ApiErrors(400, "Missing required fields");
    }
    if (
      !feature_limits.databases &&
      !feature_limits.allocations &&
      !feature_limits.backups
    ) {
      throw new ApiErrors(400, "Invalid feature limits");
    }
    const body = {
      name,
      user,
      egg: eggInfo,
      docker_image,
      startup,
      limits,
      environment,
      feature_limits,
      allocation,
      deploy,
      description,
    };

    const [pteroRes, pteroError] = await createPteroServer(body);
    if (pteroError) {
      throw new ApiErrors(400, pteroError.message);
    }

    
    // Save the server in the database
    await Server.create({
      server_id: pteroRes.data.attributes.id,
      server_name: name,
      server_description: description,
      cost,
      serverInfo: {
        cpu: limits.cpu,
        ram: limits.memory,
        disk: limits.disk,
        backups: feature_limits.backups,
        location: deploy.locations[0],
        node: pteroRes.data.attributes.node,
        egg: eggInfo,
        status,
        ports: feature_limits.allocations,
        databases: feature_limits.databases,

      },
      user_id: user,
      location: deploy.locations[0],
      node: pteroRes.data.attributes.node,
    })

    await Egg.updateOne({
      id: eggInfo
    },
    {
      $push : {
        servers: pteroRes.data.attributes.id
      }
    }
  )

    res.status(200).json(new ApiResponse(200, pteroRes.data));
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const getServerInfo = async (req, res) => {
  const serverId = req.params.id;
  try {
    const severInfo  = await Server.findOne({server_id: serverId})
    return res
      .status(200)
      .json(new ApiResponse(200, severInfo, "Server info found"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
}

const getServerDetails = async (req, res) => {
  const serverId = req.params.id;
  //console.log(serverId)
  try {
    const [pteroRes, pteroError] = await getServer(serverId);
    if (pteroError) {
      throw new ApiErrors(400, pteroError.message);
    }
    res.status(200).json(new ApiResponse(200, pteroRes));
  } catch (error) {
    // console.error(error);
    res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const updateServer = async (req, res) => {
  const severId = req.params.id;
  const { allocation, memory, swap, disk, io, cpu, feature_limits, threads, cost = 0 , status = "free"} =
    req.body;

  const body = req.body;
  try {
    if(!severId)  throw new ApiErrors(401, 'Server Id not specified')
    const [pteroRes, pteroError] = await updatePteroServer(severId, body);
    if (pteroError) {
      throw new ApiErrors(400, pteroError.message);
    }
    // get the server info
    const serverInfo = await Server.findOne({server_id: severId})
    const serverData = serverInfo.serverInfo;

    if(feature_limits.databases){
        serverInfo.serverInfo.databases = feature_limits.databases
    }


    if(feature_limits.allocations){
        serverInfo.serverInfo.ports = feature_limits.allocations
    }

    if(feature_limits.backups){
        serverInfo.serverInfo.backups = feature_limits.backups
    }

    if(allocation){
      serverInfo.serverInfo.location = allocation
    }

    if(cost){
      serverInfo.cost = cost
    }

    if(status){
      serverInfo.serverInfo.status = status
    }


    if(memory){
      serverInfo.serverInfo.ram = memory
    }
    if(cpu){
      serverInfo.serverInfo.cpu = cpu
    }
    if(disk){
      serverInfo.serverInfo.disk = disk
    }


     await serverInfo.save();

    // update the database
    // const server = await Server.findOneAndUpdate(
    //   { server_id: severId },
    //   {
    //     ...serverInfo,
        
    //     serverInfo: {
    //       ...serverData,
    //       cpu,
    //       ram: memory,
    //       disk,
    //       backups: feature_limits.backups,
    //       databases: feature_limits.databases,
    //       ports: feature_limits.allocations,
    //     },
    //   }
    // );

  

    return res.status(200).json(new ApiResponse(200, pteroRes.data));
  } catch (error) {
    console.error(error);
    //console.log(error.message)
    //console.log(error.response.data)
    res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const deletePteroServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    const [pteroRes, pteroError] = await deleteServer(serverId);
    if (pteroError) {
      throw new ApiErrors(400, pteroError.message);
    }
    // delete from database
    await Server.findOneAndDelete({ server_id: serverId });
    return res.status(200).json(new ApiResponse(200, pteroRes));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const updateServerDetails = async (req, res) => {
  const serverId = req.params.id;
  const { name, external_id, description, email } = req.body;
  let {user} = req.body
  // if (
  //   [name, user, external_id, description].some((value) => value === undefined)
  // ) {
  //   throw new ApiErrors(400, "Missing required fields");
  // }
 
  try {
    if(!user ){
      if(email){
        const userData = await User.findOne({email});
        if(!userData) throw new ApiErrors(401, 'Email is not associated with any user.')
         user = userData.pteroId;
      }
    }
  } catch (error) {
    return res
    .status(401)
    .json(
      new ApiResponse(error.statusCode || 401, error.message || 'Email is not associated with any user')
    )
  }
  console.log('Ptero id: ', user)

  
  const body = {
    name,
    user ,
    external_id,
    description,
  };
  try {
    const pteroRes = await axios.patch(`${apiUrl}/${serverId}/details`, body, {
      headers,
    });

    // update the database
    await Server.findOneAndUpdate(
      { server_id: serverId },
      {
        server_name: name,
        server_description: description,
        user_id: user,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server updated"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const updateServerStartup = async (req, res) => {
  try {
  const serverId = req.params.id;
  const getServerDetails = await axios.get(`${apiUrl}/${serverId}`, {
    headers,
  });
  const sData = getServerDetails.data.attributes;

  const { startup = sData.container.startup_command, environment = sData.container.environment, egg = sData.egg, image = sData.container.image, skip_scripts = false } = req.body;

  console.log(environment)

  // if (startup === undefined) {
  //   throw new ApiErrors(400, "Missing required fields");
  // }
  const body = {
    startup: startup,
    environment: environment,
    egg: egg,
    image: image,
    skip_scripts: skip_scripts,
  };
  console.log(startup)
  
    const pteroRes = await axios.patch(`${apiUrl}/${serverId}/startup`, body, {
      headers,
    });

    const serverDetail = await Server.findOne({server_id: serverId})
    const serverData = serverDetail.serverInfo;
    serverData.egg = egg;
    //console.log(egg)
    // update the database
    await Server.findOneAndUpdate(
      { server_id: serverId },
      {
        ...serverDetail,
        serverInfo: {
          ...serverData,
          
        },
      },
      {
        $set:{
          "serverInfo.egg" : egg,
        }
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server updated"));
  } catch (error) {
    // console.error(error);
    // //console.log(error.message)
    //console.log(error.response.data)
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const suspendServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    const pteroRes = await axios.post(
      `${apiUrl}/${serverId}/suspend`,
      {},
      {
        headers,
      }
    );

    // update the database
    await Server.findOneAndUpdate(
      { server_id: serverId },
      {
        serverInfo: {
          status: "suspended",
        },
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server suspended"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const unsuspendServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    const pteroRes = await axios.post(
      `${apiUrl}/${serverId}/unsuspend`,
      {},
      {
        headers,
      }
    );
    // update the database
    await Server.findOneAndUpdate(
      { server_id: serverId },
      {
        serverInfo: {
          status: "not suspended",
        },
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server unsuspended"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const reinstallServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    const pteroRes = await axios.post(
      `${apiUrl}/${serverId}/reinstall`,
      {},
      {
        headers,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server reinstalled"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const forceDeleteServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    await axios.delete(`${apiUrl}/${serverId}/force`, {
      headers,
    });
    // delete from database
    await Server.findOneAndDelete({ server_id: serverId });
    return res.status(200).json(new ApiResponse(200, true, "Server deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const renewServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    // renew the server
    await Server.findOneAndUpdate(
      { server_id: serverId },
      {
        serverInfo: {
          lastRenewed: Date.now(),
          status: "not suspended",
        },
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data, "Server renewed"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const getDatabasesOfServer = async (req, res) => {
  const serverId = req.params.id;
  try {
    const pteroRes = await axios.get(
      `${apiUrl}/${serverId}/databases?include=password,host`,
      {
        headers,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data.data, "Server databases"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const getDatabaseDetails = async (req, res) => {
  const { server_id, database_id } = req.params;
  try {
    const pteroRes = await axios.get(
      `${apiUrl}/${server_id}/databases/${database_id}?include=password,host`,
      {
        headers,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data.attributes, "Database details"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const createDatabase = async (req, res) => {
  const serverId = req.params.id;
  const { database, remote, host } = req.body;
  try {
    if ([database, remote, host].some((value) => value === undefined)) {
      throw new ApiErrors(400, "Missing required fields");
    }
    const body = {
      database,
      remote,
      host,
    };
    const pteroRes = await axios.post(`${apiUrl}/${serverId}/databases`, body, {
      headers,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, pteroRes.data.attributes, "Database created"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

const deleteDatabase = async (req, res) => {
  const { server_id, database_id } = req.params;
  try {
    await axios.delete(`${apiUrl}/${server_id}/databases/${database_id}`, {
      headers,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, true, "Database deleted successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
}

const resetPassword = async (req, res) => {
  const { server_id, database_id } = req.params;
  try {
   await axios.post(
      `${apiUrl}/${server_id}/databases/${database_id}/reset-password`,
      {},
      {
        headers,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, true, "Password reset"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }

}

const getFreeServer = async (req, res) => {
  try {
    const user_id = req.user.pteroId;

    const freeServer = await Server.find(
      {
       $and:[
          {
            
            user_id,
          },
          {
           "serverInfo.status": "free",
          }
       ]
      }
    )
    if(freeServer.length === 0){
      return res
        .status(200)
        .json(new ApiResponse(200, null, "No free server found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, freeServer, "Free Server(s) found"));

  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Free Server not found"
        )
      );
  }
}

const getServersOfUser = async (req, res) => {
  try {
    const user_id = req.user.pteroId;
    const servers = await Server.find({
      user_id,
    })
    return res
      .status(200)
      .json(new ApiResponse(200, servers, "Servers found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
}



const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find();
    return res
      .status(200)
      .json(new ApiResponse(200, servers, "All servers fetched"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
}

const isServerOwner = async (req, res) => {
  const userId = req.user.pteroId;
  const serverId = req.params.id;
  
  //console.log(serverId)
  try {
    const user = await User.findById(req.user._id)
    if(user.isAdmin){
      return res
      .status(200)
      .json(new ApiResponse(200, true, "Admin User"));
    }
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          false,
          "Internal Server Error"
        )
      );
  }
  try {
    const server = await Server.findOne({
      server_id: serverId,
      user_id: userId,
    })
    if(server){
      return res
      .status(200)
      .json(new ApiResponse(200, true, "Server found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200, false, "Server not found"));

  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          false,
          error.message || "Internal Server Error"
        )
      );
  }
}


const deleteServerByPteroId = async (req, res) => {
  const {id} = req.body
  try {
    if(!id) throw new ApiErrors(401, "No Server Id")
    
    const server = await Server.findOne({
      server_id: id
    })  
    if(!server) throw new ApiErrors(401, "No server found")
      //console.log(process.env.PTEORDACTYL_KEY)
    const deletePteroServer = await axios.delete(`${process.env.PTEORDACTYL_URL}/api/application/servers/${id}`,{
      headers:{
        "Accept": 'application/json',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PTEORDACTYL_KEY}`,
      }
    }) 
    await Server.deleteOne({
      server_id: id
    })

    const response = await Egg.updateOne({
      servers :{
        $in: [id]
      }
    },
  {
    $pull: {
      servers: id
    }
  })
    //console.log(response)



    return res
    .status(201)
    .json(
      new ApiResponse(201, true, 'Server deleted ')
    )
  } catch (error) {
    //console.log(error)
    return res
    .status(401)
    .json(
      new ApiResponse(401, false, 'Server deletion failed')
    )
  }
}

const getOwnerOfServerByPteroId = async (req, res) => {
  try {
    const {server_id} = req.body;
    const server = await Server.findOne({
      server_id
    })
    if(!server) {
      throw new ApiErrors(401, 'Server  not found')
    }
    const user = await User.findOne({
      pteroId: server.user_id
    })
    if(!user) {
      throw new ApiErrors(401, 'Server owner not found')
    }
    return res
    .status(201)
    .json(
      new ApiResponse(201, user, 'User found')
    )
  } catch (error) {
    console.log(error)
    return res
    .status(error.stausCode || 401)
    .json(
      new ApiResponse(201, null, 'User found')
    )
  }
}


module.exports = {
  getOwnerOfServerByPteroId,
  deleteServerByPteroId,
  isServerOwner,
  getAllServers,
  updateServer,
  getServerDetails,
  deletePteroServer,
  createServer,
  updateServerDetails,
  updateServerStartup,
  suspendServer,
  unsuspendServer,
  reinstallServer,
  forceDeleteServer,
  renewServer,
  getDatabasesOfServer,
  getDatabaseDetails,
  createDatabase,
  deleteDatabase,
  resetPassword,
  getFreeServer,
  getFreeServerOfUser,
  getServerInfo,
  getServersOfUser
};
