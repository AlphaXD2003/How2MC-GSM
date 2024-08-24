const { Types, Schema, model } = require("mongoose");

const NodeSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "No description provided",
    },
    location: {
      type: Number,
      unique: true,
    },
    servers: {
      type: [Number],
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    fqdn: {
      type: String,
      required: true,
    },
    scheme: {
      type: String,
      default: "http",
    },
    behindProxy: {
      type: Boolean,
      default: false,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    memory: {
      type: Number,
      default: 0,
    },
    memoryOverallocate: {
      type: Number,
      default: 0,
    },
    disk: {
      type: Number,
      default: 0,
    },
    diskOverallocate: {
      type: Number,
      default: 0,
    },
    uploadSize: {
      type: Number,
      default: 0,
    },
    daemonListen: {
      type: Number,
      default: 8080,
    },
    daemonSFTPPort: {
      type: Number,
      default: 2022,
    },
    daemonBase: {
      type: String,
      default: "/var/lib/pterodactyl/volumes",
    },
  },
  { timestamps: true }
);

const Node = model("Node", NodeSchema);
module.exports = Node;
