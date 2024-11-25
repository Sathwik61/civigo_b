const express = require('express');
const { signup, login,getUserProfile1,postUserProfile1,getCost,updateCost } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { postProjects,getProjects,updateProject,deleteProject,updatePerticularSubwork ,getSubworks,updateSubworks} = require('../controllers/projectcontroller');
const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.get('/profile', protect, getUserProfile1);
router.post('/profile', protect, postUserProfile1);
router.get('/cost',protect, getCost);
router.post('/cost',protect, updateCost);

router.get('/project',protect, getProjects);
router.post('/project',protect, postProjects);

router.post('/project/update', protect, updateProject);
router.post('/project/delete', protect, deleteProject);

router.get('/projectdetails/:pid', protect, getSubworks); 
router.post('/project/update/:id', protect, updateSubworks);

// subwork
router.post('/project/saveSubworks/:pid', protect, updatePerticularSubwork);

module.exports = router;
