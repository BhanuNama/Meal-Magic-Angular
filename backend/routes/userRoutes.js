const express = require('express');
const {
  register,
  login,
  resetPassword,
  getAllUsers
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/resetPassword', resetPassword);
router.get('/getAllUsers', getAllUsers);

module.exports = router;

