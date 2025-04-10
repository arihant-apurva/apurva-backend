const express = require("express")
const router = express.Router()
const {searchFunctionality} = require('../controllers/search-controller')

router.route('/:collectionName').get(searchFunctionality)

module.exports = router;