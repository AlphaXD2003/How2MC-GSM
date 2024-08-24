const Order = require("../../models/order.model");
const Product = require("../../models/products.model");
const Egg = require("../../models/eggs.model");
const Server = require("../../models/server.model");
const User = require("../../models/user.model");
const {ApiResponse} = require("../../utils/ApiResponse");
const {ApiErrors} = require("../../utils/ApiErrors");

const createOrder = async (req, res) => {
  const { price, productId, eggId, serverId,order_id } = req.body;
  const user = await User.findById(req.user.id);
  const product = await Product.findById(productId);
  const egg = await Egg.findById(eggId);
  const server = await Server.findById(serverId);

  if (!order_id) {
    return res.status(400).json({ message: "Order id not found" });
  }
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }
  if (!egg) {
    return res.status(400).json({ message: "Egg not found" });
  }
  if (!server) {
    return res.status(400).json({ message: "Server not found" });
  }

  const order = new Order({
    order_id,
    userId: user._id,
    price,
    productId,
    eggId,
    serverId,
  });
  try {
    await order.save();
    return res
    .status(201)
    .json(
        new ApiResponse(201, order)
    );
  } catch (error) {
    return res.status(500).json({ message: "Error creating order" });
  }
};

const getOrdersByUserId = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

try {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    
      const orders = await Order.find({ userId });
    
      return res.status(200)
      .json(new ApiResponse(200, orders));
} catch (error) {
    return res
    .status(500)
    .json(new ApiResponse(500, "Error getting orders"));
}
};

const getOrderById = async (req, res) => {
try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId);
    
      if (!order) {
        return res.status(400).json(new ApiErrors(400, "Order not found"));
      }
    
      return res.status(200).json(new ApiResponse(200, order));
} catch (error) {
    return res
    .status(500)
    .json(new ApiResponse(500, "Error getting order"));
}
};


const updateOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findOne({
    
      order_id: orderId
    
  });

  if (!order) {
    return res.status(400).json(new ApiErrors(400, "Order not found"));
  }

  const { price, productId, eggId, serverId, startingDateAndTime, endingDateAndTime, status } = req.body;

  if (price) {
    order.price = price;
  }
  if (productId) {
    order.productId = productId;
  }
  if (eggId) {
    order.eggId = eggId;
  }
  if (serverId) {
    order.serverId = serverId;
  }
  if (startingDateAndTime) {
    order.startingDateAndTime = startingDateAndTime;
  }
  if (endingDateAndTime) {
    order.endingDateAndTime = endingDateAndTime;
  }
  if (status) {
    order.currentStatus = status;
  }

  try {
    await order.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, order)
    );
  } catch (error) {
    return res.status(500).json({ message: "Error updating order" });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(400).json(new ApiErrors(400, "Order not found"));
  }

  order.currentStatus = "cancelled";

  try {
    await order.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, order)
    );
  } catch (error) {
    return res.status(500).json({ message: "Error cancelling order" });
  }
};


const pauseSubscription = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(400).json(new ApiErrors(400, "Order not found"));
  }

  order.currentStatus = "paused";

  try {
    await order.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, order)
    );
  } catch (error) {
    return res.status(500).json({ message: "Error pausing subscription" });
  }
};

const resumeSubscription = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(400).json(new ApiErrors(400, "Order not found"));
  }

  order.currentStatus = "renewed";

  try {
    await order.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, order)
    );
  } catch (error) {
    return res.status(500).json({ message: "Error resuming subscription" });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
  updateOrder,
  pauseSubscription,
  resumeSubscription
};