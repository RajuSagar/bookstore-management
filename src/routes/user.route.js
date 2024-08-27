const express = require('express');
const router = express.Router();
const { loginUser, registerUser, registerAdmin, logoutUser, getCurrentUser, testUser, editUserStoreLocation } = require('../controllers/user.controller');
const verifyToken  = require('../middlewares/auth');

// User routes
router.post('/register', registerUser);
router.post('/adminRegister', registerAdmin);
router.post('/editUserStoreLocation/:id', editUserStoreLocation);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.get('/current-user',verifyToken, getCurrentUser);
router.get('/test',testUser);
module.exports = router;
