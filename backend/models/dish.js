const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    dishName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dish', dishSchema);

