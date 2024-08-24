// I will just sync the nodes, locations, nest and the eggs that are present in the Pterodactyl
// panel with the database.

const axios = require("axios");
const chalk = require("chalk");
const { ApiResponse } = require("./ApiResponse");
const { ApiErrors } = require("./ApiErrors");
const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const { Node, Location, Nest, Egg, Server } = require("../models");

const headers = {
  Authorization: `Bearer ${PTEORDACTYL_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const syncNodes = async () => {
  try {
    const nodeRes = await axios.get(
      `${PTEORDACTYL_URL}/api/application/nodes?include=servers,location`,
      {
        headers,
      }
    );
    const nodes = nodeRes.data.data;

    //console.log(chalk.bgGreen("Syncing nodes with Pterodactyl panel"));

    for (const nodeData of nodes) {
      const node = nodeData.attributes;
      const locationId = node.relationships.location.attributes.id;
      let serverIds = [];
      for (const server of node.relationships.servers.data) {
        serverIds.push(server.attributes.id);
      }

      // Find the node using await
      const doc = await Node.findOne({ id: node.id });

      if (doc) {
        // Update existing node
        doc.name = node.name;
        doc.uuid = node.uuid;
        doc.description = node.description;
        doc.location = locationId;
        doc.servers = serverIds;
        doc.isPublic = node.public;
        doc.fqdn = node.fqdn;
        doc.scheme = node.scheme;
        doc.behindProxy = node.behind_proxy;
        doc.maintenanceMode = node.maintenance_mode;
        doc.memory = node.memory;
        doc.memoryOverallocate = node.memory_overallocate;
        doc.disk = node.disk;
        doc.diskOverallocate = node.disk_overallocate;
        doc.daemonListen = node.daemon_listen;
        doc.daemonSFTPPort = node.daemon_sftp;
        doc.uploadSize = node.upload_size;
        await doc.save();
      } else {
        // Create a new node
        await Node.create({
          id: node.id,
          name: node.name,
          description: node.description,
          location: locationId,
          servers: serverIds,
          isPublic: node.public,
          fqdn: node.fqdn,
          scheme: node.scheme,
          behindProxy: node.behind_proxy,
          maintenanceMode: node.maintenance_mode,
          memory: node.memory,
          memoryOverallocate: node.memory_overallocate,
          disk: node.disk,
          diskOverallocate: node.disk_overallocate,
          uuid: node.uuid,
          daemonListen: node.daemon_listen,
          daemonSFTPPort: node.daemon_sftp,
          uploadSize: node.upload_size,
        });
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};

const syncLocations = async () => {
  try {
    const locationRes = await axios.get(
      `${PTEORDACTYL_URL}/api/application/locations?include=nodes`,
      {
        headers,
      }
    );

    const locations = locationRes.data.data;
    //console.log(chalk.bgGreen("Syncing locations with Pterodactyl panel"));

    for (const locationData of locations) {
      const location = locationData.attributes;
      const doc = await Location.findOne({ id: location.id });

      if (doc) {
        doc.short = location.short;
        doc.long = location.long;
        doc.country = location.country;
        await doc.save();
      } else {
        await Location.findOneAndDelete({ id: location.id });
        await Location.create({
          id: location.id,
          short: location.short,
          long: location.long,
          country: location.country,
          nodes: location.relationships.nodes.data.map(
            (node) => node.attributes.id
          ),
        });
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};

const syncNests = async () => {
  try {
    const nestRes = await axios.get(
      `${PTEORDACTYL_URL}/api/application/nests?include=eggs,servers`,
      {
        headers,
      }
    );
    const nests = nestRes.data.data;

    //console.log(chalk.bgGreen("Syncing nests with Pterodactyl panel"));

    for (const nestData of nests) {
      const nest = nestData.attributes;

      // Find the nest using await
      const doc = await Nest.findOne({ id: nest.id });

      if (doc) {
        // Update existing nest
        doc.name = nest.name;
        doc.description = nest.description;
        doc.eggs = nest.relationships.eggs.data.map((egg) => egg.attributes.id);
        doc.servers = nest.relationships.servers.data.map(
          (server) => server.attributes.id
        );
        await doc.save();
      } else {
        // Create a new nest
        await Nest.create({
          id: nest.id,
          name: nest.name,
          description: nest.description,
          eggs: nest.relationships.eggs.data.map((egg) => egg.attributes.id),
          servers: nest.relationships.servers.data.map(
            (server) => server.attributes.id
          ),
        });
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};

const syncEggs = async () => {
  try {
    const nestRes = await axios.get(
      `${PTEORDACTYL_URL}/api/application/nests?include=eggs`,
      {
        headers,
      }
    );
    const nests = nestRes.data.data;
    //console.log(chalk.bgGreen("Syncing eggs with Pterodactyl panel"));

    for (const nest of nests) {
      const nestId = nest.attributes.id; // Store nest ID for clarity

      for (const eggData of nest.attributes.relationships.eggs.data) {
        const egg = eggData.attributes;

        // Find the egg using await
        const doc = await Egg.findOne({ id: egg.id });

        const eggDetailsUrl = `${PTEORDACTYL_URL}/api/application/nests/${nestId}/eggs/${egg.id}?include=servers`;

        if (doc) {
          // Update existing egg
          doc.name = egg.name;
          doc.description = egg.description;
          const eggDetailsRes = await axios.get(eggDetailsUrl, { headers });
          doc.servers =
            eggDetailsRes.data.attributes.relationships.servers.data.map(
              (server) => server.attributes.id
            );
          doc.parentNest = nestId;
          await doc.save();
        } else {
          // Create a new egg
          const newEggData = {
            id: egg.id,
            name: egg.name,
            description: egg.description,
            servers: await getEggServerIds(nestId, egg.id), // Separate function for cleaner code
            parentNest: nestId,
          };
          await Egg.create(newEggData);
        }
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};

const syncServers = async () => {
  try {
    const serverRes = await axios.get(
      `${PTEORDACTYL_URL}/api/application/servers`,
      {
        headers,
      }
    );
    const servers = serverRes.data.data;
  
    //console.log(chalk.bgGreen("Syncing servers with Pterodactyl panel"));

    for (const serverData of servers) {
      const server = serverData.attributes;
      const doc = await Server.findOne({ server_id: server.id });
      //console.log(server.id)
      const serverDetails = await axios.get(
        `${PTEORDACTYL_URL}/api/application/servers/${server.id}`,
        { headers }
      );

      if (doc) {
        // Update
        doc.server_id = Number(serverDetails.data.attributes.id);
        doc.server_name = serverDetails.data.attributes.name;
        doc.server_description = serverDetails.data.attributes.description;
        doc.serverInfo.cpu = Number(serverDetails.data.attributes.limits.cpu);
        doc.serverInfo.ram = Number(serverDetails.data.attributes.limits.memory);
        doc.serverInfo.disk = Number(serverDetails.data.attributes.limits.disk);
        doc.serverInfo.backups = Number(serverDetails.data.attributes.feature_limits.backups);
        doc.serverInfo.databases = Number(serverDetails.data.attributes.feature_limits.databases);
        doc.serverInfo.ports = Number(serverDetails.data.attributes.feature_limits.allocations);
        doc.serverInfo.location = Number(serverDetails.data.attributes.allocation);
        doc.serverInfo.node = Number(serverDetails.data.attributes.node);
        doc.serverInfo.egg = Number(serverDetails.data.attributes.egg);
        doc.user_id = serverDetails.data.attributes.user;
        await doc.save().then(() =>{
          //console.log(chalk.bgGreen("Server updated successfully"));
        });
      } else {
        // Create
        const newServerData = {
          server_id: serverDetails.data.attributes.id,
          server_name: serverDetails.data.attributes.name,
          server_description: serverDetails.data.attributes.description,
          serverInfo: {
            cpu: Number(serverDetails.data.attributes.limits.cpu),
            ram: Number(serverDetails.data.attributes.limits.memory),
            disk: Number(serverDetails.data.attributes.limits.disk),
            backups: Number(serverDetails.data.attributes.feature_limits.backups),
            databases: Number(serverDetails.data.attributes.feature_limits.databases),
            ports: Number(serverDetails.data.attributes.feature_limits.allocations),
            location: Number(serverDetails.data.attributes.allocation),
            node: Number(serverDetails.data.attributes.node),
            egg: Number(serverDetails.data.attributes.egg),
          },
          user_id: serverDetails.data.attributes.user,
          cost: 0,
        };
        await Server.create(newServerData).then(() =>{
          //console.log(chalk.bgGreen("Server created successfully"));
        });
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};

async function getEggServerIds(nestId, eggId) {
  const eggDetailsUrl = `${PTEORDACTYL_URL}/api/application/nests/${nestId}/eggs/${eggId}?include=servers`;
  const eggDetailsRes = await axios.get(eggDetailsUrl, { headers });
  return eggDetailsRes.data.attributes.relationships.servers.data.map(
    (server) => server.attributes.id
  );
}

const syncDBwithPtero = async () => {
  try {
    await syncLocations();
    await syncNodes();
    await syncNests();
    await syncEggs();
    await syncServers();
    await axios.get(`${process.env.BACKEND_URL}/api/v1/location/sync-location-node`,)

    return [true, null];
  } catch (error) {
    //console.log(error.message);
    return [null, error];
  }
};

module.exports = {
  syncDBwithPtero,
  syncNodes,
  syncLocations,
  syncNests,
  syncEggs,
  syncServers,
};
