const express = require('express');
const router = express.Router();
const Products = require('../controllers/addProduct');
const authcontroller= require('../controllers/AuthenticationController')
const authenticateToken = require('../middlewares/authMiddleware');


router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);
router.post('/addproduct',authenticateToken, Products.addProduct );
router.post('/request-reset-password', authcontroller.requestResetPassword);
router.post('/reset-password/:token', authcontroller.resetPassword);
router.post('/update', Products.updateFile);
router.post('/delete', Products.deleteFile);
router.post('/auctionstart',  Products.auctionStart )
router.get('/auction/status', Products.checkAuctionStatus);


module.exports = router;
