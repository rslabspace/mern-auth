const express = require('express');

const 
  userController = require('../controllers/userController'),
  { protect } = require('../middleware/authMiddleware')
;

const router = express.Router();

router.post('/', userController.registerUser);
router.post('/auth', userController.authUser);
router.post('/logout', userController.logoutUser);
router.route('/profile')
  .get(protect, userController.getUserProfile)
  .put(protect, userController.updateUserProfile)
;


module.exports = router;