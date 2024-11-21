const express = require('express');
const { signup, login,getUserProfile1,postUserProfile1,getCost,updateCost } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.get('/profile', protect, getUserProfile1);
router.get('/profile', protect, postUserProfile1);
router.get('/cost', getCost);
router.post('/cost', updateCost);
module.exports = router;
