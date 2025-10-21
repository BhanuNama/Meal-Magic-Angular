const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Dish = require("../models/dish");

exports.addOrder = async (req, res) => {
  try {
    const { orderItems, user, shippingAddress, billingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "User ID is required" });
    }

    // Create base order
    const newOrder = new Order({
      user: new mongoose.Types.ObjectId(user),
      orderItems: [],
      totalAmount: 0,
      orderStatus: "Pending",
      shippingAddress,
      billingAddress,
    });

    const savedOrder = await newOrder.save();

    let totalAmount = 0;
    const orderItemIds = [];

    // Iterate each item
    for (const item of orderItems) {
      const dish = await Dish.findById(item.dish);

      if (!dish) {
        return res
          .status(404)
          .json({ message: `Dish with ID ${item.dish} not found` });
      }

      if (!dish.isAvailable) {
        return res
          .status(400)
          .json({ message: `Dish ${dish.dishName} is currently unavailable` });
      }

      const orderItem = new OrderItem({
        dish: dish._id,
        quantity: item.quantity,
        price: dish.price,
        order: savedOrder._id,
      });

      const savedItem = await orderItem.save();
      orderItemIds.push(savedItem._id);
      totalAmount += dish.price * item.quantity;
    }

    savedOrder.orderItems = orderItemIds;
    savedOrder.totalAmount = totalAmount;

    await savedOrder.save();

    res
      .status(201)
      .json({ 
        message: "Order Placed Successfully", 
        order: {
          _id: savedOrder._id,
          totalAmount: savedOrder.totalAmount,
          orderStatus: savedOrder.orderStatus,
          createdAt: savedOrder.createdAt
        }
      });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username email mobileNumber")
      .populate({
        path: "orderItems",
        populate: {
          path: "dish",
          select: "dishName cuisine coverImage price",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email mobileNumber")
      .populate({
        path: "orderItems",
        populate: {
          path: "dish",
          select: "dishName cuisine coverImage price",
        },
      });

    if (!order) {
      return res.status(404).json({ message: `Order with ID ${req.params.id} not found` });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "username email mobileNumber")
      .populate({
        path: "orderItems",
        populate: {
          path: "dish",
          select: "dishName cuisine coverImage price",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus, shippingAddress, billingAddress } = req.body;
    
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (shippingAddress) updateData.shippingAddress = shippingAddress;
    if (billingAddress) updateData.billingAddress = billingAddress;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("user", "username email mobileNumber")
      .populate({
        path: "orderItems",
        populate: {
          path: "dish",
          select: "dishName cuisine coverImage price",
        },
      });

    if (!updatedOrder) {
      return res.status(404).json({ message: `Order with ID ${req.params.id} not found` });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    // First delete all order items
    await OrderItem.deleteMany({ order: req.params.id });
    
    // Then delete the order
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: `Order with ID ${req.params.id} not found` });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

