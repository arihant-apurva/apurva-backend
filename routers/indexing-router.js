const express = require("express")
const indexingController = require("../controllers/indexing-controller")
// const {paginationController} = require("../controllers/pagination-controller")
// const {paginatedResults} = require('../controllers/pagination-controller')
// const contentType = require('../models/content-type-model')
// const { upload, uploadFile } = require('../controllers/Imagehandler');

const router = express.Router()

router.route('/list/:collectionName').get(indexingController.indexingNews)
router.route('/regional-news/list/:collectionName').get(indexingController.countryData)

// router.route('/add').post(contentTypeController.addList)
// router.route('/update/:id').put(contentTypeController.updateList)
// router.route('/view/:id').get(contentTypeController.viewListItem)
// router.route('/delete/:id').get(contentTypeController.deleteItem)
// router.route('/fetchAll').get(contentTypeController.fetchAllContentType)
// router.route('/users').get(paginatedResults("content-type"), paginationController)

// router.post('/upload', upload.single('filedata'), uploadFile);


module.exports = router;