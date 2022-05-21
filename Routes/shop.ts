// const express = require("express");
import Express from 'express'
const router = Express.Router();
//const shopController = require('../Controllers/shop.controller')
import {getAllShops} from '../Controllers/shop.controller'

router.get('/', getAllShops)

export default router
