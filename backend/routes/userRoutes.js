const express = require('express');
const {
  register,
  login,
  resetPassword,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/resetPassword', resetPassword);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserById/:id', getUserById);

module.exports = router;

