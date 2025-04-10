const express = require('express');
const router = express.Router();
const {paginationController} = require("../controllers/pagination-controller");
const {paginatedResults} = require('../controllers/pagination-controller');
const { uploadVideoMiddleware, uploadVideo, uploadVideoLink, fetchAllContentType ,deleteItem,updateList,viewListItem} = require('../controllers/Videocontroller');
router.post('/upload', uploadVideoMiddleware, uploadVideo);
router.route('/fetchAll').get(fetchAllContentType);
router.route('/delete/:id').get(deleteItem);
router.route('/update/:id').put(updateList)
router.route('/view/:id').get(viewListItem)
router.route('/users').get(paginatedResults("videos"), paginationController);
router.post('/upload-link', uploadVideoLink);

module.exports = router;




