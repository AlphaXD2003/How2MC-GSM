const { Types, Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  order_id:{
    type: String,
    required: true,
  },
  userId:{
    type: Types.ObjectId,
    required: true,
    ref: "User"
  },
  price:{
    type: Number,
    required: true,
  },
  productId:{
    type: Types.ObjectId,
    required: true,
    ref: "Product"
  },
  eggId:{
    type: Number,
    
  },
  currentStatus:{
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "delivered", "cancelled", "paused", "renewed", "failed"]
  },
  startingDateAndTime:{
    type: Date,
    required: true,
    default: Date.now()
  },
  endingDateAndTime:{
    type: Date,
    required: true,
    default: Date.now()
  },
  serverId:{
    type: Types.ObjectId,
    required: false,
    ref: "Server"
  }
});

const Order = model("Order", OrderSchema);
module.exports = Order;