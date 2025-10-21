const Review = require("../models/review");
const Dish = require("../models/dish");
const User = require("../models/user");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "username email mobileNumber")
      .populate("dish", "dishName description cuisine price availability coverImage");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "username email mobileNumber")
      .populate("dish", "dishName description cuisine price availability coverImage");
    if (!review) {
      return res.status(404).json({ message: `Cannot find any review with ID ${req.params.id}` });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("user", "username email mobileNumber")
      .populate("dish", "dishName description cuisine price availability coverImage");
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByDishId = async (req, res) => {
  try {
    const reviews = await Review.find({ dish: req.params.dishId })
      .populate("user", "username email mobileNumber")
      .populate("dish", "dishName description cuisine price availability coverImage");
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this dish" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { reviewText, rating, user, dish } = req.body;
    const newReview = await Review.create({ reviewText, rating, user, dish });
    res.status(201).json({ message: "Review Added Successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: `Cannot find any review with ID ${req.params.id}` });
    }
    res.status(200).json({ message: "Review Updated Successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: `Cannot find any review with ID ${req.params.id}` });
    }
    res.status(200).json({ message: "Review Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

