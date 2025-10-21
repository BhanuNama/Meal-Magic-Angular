const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/getAllReviews", reviewController.getAllReviews);
router.get("/getReviewById/:id", reviewController.getReviewById);
router.get("/getReviewsByUserId/:userId", reviewController.getReviewsByUserId);
router.get("/getReviewsByDishId/:dishId", reviewController.getReviewsByDishId);
router.post("/addReview", reviewController.addReview);
router.put("/updateReview/:id", reviewController.updateReview);
router.delete("/deleteReview/:id", reviewController.deleteReview);

module.exports = router;

