const { Schema, model, Types } = require("mongoose");

const ServerSchema = new Schema({
  server_id: {
    type: Number,
    required: true,
    unique: [true, "Server ID already exists"],
  },
  server_name: {
    type: String,
    required: true,
  },
  server_description: {
    type: String,
    default: "No description provided",
  },
  serverInfo: {
    cpu: {
      type: Number,
      required: true,
    },
    ram: {
      type: Number,
      required: true,
    },
    disk: {
      type: Number,
      required: true,
    },
    backups: {
      type: Number,
      required: true,
    },
    databases: {
      type: Number,
      required: true,
    },
    ports: {
      type: Number,
      required: true,
    },

    location: {
      type: Number,
      required: true,
    },
    node: {
      type: Number,
      required: true,
    },
    egg: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "free",
      enum: ["free", "paid"],
    },
    lastRenewed: {
      type: Date,
      default: Date.now,
    },
  },
  user_id: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  sub_user_id:{
    type:[Types.ObjectId],  
    ref: 'User',
    required: false,
  }
}, { timestamps: true });

ServerSchema.methods.isDueForRenewal = function () {
  const now = new Data();
  const diffInDays = Math.floor(
    (now - this.lastRenewed) / (1000 * 60 * 60 * 24)
  );
  return diffInDays;
};

const Server = model("Server", ServerSchema);

module.exports = Server;
