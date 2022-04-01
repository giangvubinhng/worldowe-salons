const express = require("express");
const router = express.Router();
const shopController = require('../Controllers/shop.controller')


router.get('/', shopController.getAllShop)


module.exports = router
