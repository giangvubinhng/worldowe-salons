import * as shopService from '../services/shop.service'
import {Request, Response, NextFunction} from 'express'

const getAllShop = async (req: Request, res: Response) => {
	try {
		const result: any = await shopService.getAllShops();
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e)
	}


}

module.exports = {
	getAllShop
}
