// const express = require("express");
import Express from 'express'
const router = Express.Router();
const shopController = require('../Controllers/shop.controller')

router.get('/', shopController.getAllShop)

module.exports = router
