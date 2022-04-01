const shopService = require("../services/shop.service")

const getAllShop = async (req, res) => {
	try {
		const result = await shopService.getAllShops();
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
