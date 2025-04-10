const multer = require('multer');
const path = require('path');
const express = require("express")
const contentTypeController = require("../controllers/content-type-controller")
const {paginationController} = require("../controllers/pagination-controller")
const {paginatedResults} = require('../controllers/pagination-controller')


const router = express.Router()

const storage = multer.diskStorage({
    destination : path.join(__dirname, '../uploads/contentTypeImages'),
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
});
const upload = multer({ storage });



router.post('/add', upload.single('contentTypeImage'), contentTypeController.addList);
router.route('/add').post(contentTypeController.addList)
router.route('/update/:id').put(contentTypeController.updateList)
router.route('/view/:id').get(contentTypeController.viewListItem)
router.route('/delete/:id').get(contentTypeController.deleteItem)
router.route('/fetchAll').get(contentTypeController.fetchAllContentType)
router.route('/users').get(paginatedResults("content-type"), paginationController)

// router.post('/upload', upload.single('filedata'), uploadFile);


module.exports = router;