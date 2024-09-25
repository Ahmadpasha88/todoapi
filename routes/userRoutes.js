const express = require('express');
const { register, login, getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth'); 
const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.get('/profile', auth, getUserProfile); 


router.put('/profile', auth, updateUserProfile); 

module.exports = router;
