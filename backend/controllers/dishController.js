const Dish = require("../models/dish");


exports.addDish = async (req, res) => {
  try {
    const newDish = await Dish.create(req.body);
    res.status(201).json({
      message: "Dish Added Successfully",
      dish: newDish
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({});
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dish By ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: `Cannot find any dish with ID ${req.params.id}` });
    }
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Dish
exports.updateDish = async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedDish) {
      return res.status(404).json({ message: `Cannot find any dish with ID ${req.params.id}` });
    }
    res.status(200).json({
      message: "Dish Updated Successfully",
      dish: updatedDish
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Dish
exports.deleteDish = async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ message: `Cannot find any dish with ID ${req.params.id}` });
    }
    res.status(200).json({ message: "Dish Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

