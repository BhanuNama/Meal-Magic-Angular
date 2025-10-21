const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");

router.post("/addDish", dishController.addDish);
router.get("/getAllDishes", dishController.getAllDishes);
router.get("/getDishById/:id", dishController.getDishById);
router.put("/updateDish/:id", dishController.updateDish);
router.delete("/deleteDish/:id", dishController.deleteDish);

module.exports = router;

