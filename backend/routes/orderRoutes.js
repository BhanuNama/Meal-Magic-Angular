const express = require('express');
const {
  addOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/addOrder', addOrder);
router.get('/getAllOrders', getAllOrders);
router.get('/getOrderById/:id', getOrderById);
router.get('/getOrdersByUserId/:userId', getOrdersByUserId);
router.put('/updateOrder/:id', updateOrder);
router.delete('/deleteOrder/:id', deleteOrder);

module.exports = router;

