const express = require("express")
const countrystateController = require("../controllers/countrystate-controller")



const router = express.Router()



router.route('/country-iso/:countryName').get(countrystateController.getCountryIsoCode);
router.route('/state-iso').get(countrystateController.getStateIsoCode);


module.exports = router;