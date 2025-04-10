const express = require("express")
const newsController = require("../controllers/news-controller")
const {paginationController} = require("../controllers/pagination-controller")
const {paginatedResults} = require('../controllers/pagination-controller')
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs= require('fs')


//destination of the file which is uploaded as per what is type of file
const getDestination = (req, file, cb) => {
    let uploadFolder = '../uploads/files'; // Default folder

    if (file.mimetype.startsWith('image')) {
        uploadFolder = '../uploads/images';
    }
    
    const destinationPath = path.join(__dirname, uploadFolder);
    
    // console.log(destinationPath);
    
    // Ensure the directory exists
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true }); // Create directory if it doesn't exist
    }
    
    cb(null, destinationPath); // Corrected: Now using `cb()`
};

const storage = multer.diskStorage({
    destination: getDestination,
    filename: (req, file, cb) => {        
        const timestamp = Date.now(); // Get current timestamp
        const uniqueName = `${timestamp}-${file.originalname}`;
        // console.log("getdestination called 1");
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.post('/add', upload.single('file'), newsController.addNews);
router.put('/update-all/:id',upload.single('file'),newsController.updateAllNews)
router.put('/update-one/:target_language/:id',upload.single('image'),newsController.updateOneNews)
router.route('/suggest/:id').put(newsController.suggestUpdate)
router.route('/approve/:id').put(newsController.approvedUpdate)
router.route('/reject/:id').put(newsController.rejectedUpdate)
router.route('/update/sensorship/:id').put(newsController.updateSensorship)
router.route('/:collectionName/view/:id').get(newsController.viewListItem)
router.route('/delete/:id').delete(newsController.deleteEnglishNews)
router.route('/delete/:target_language/:id').delete(newsController.deleteTargetLanguageNews)
router.route('/changeStatus/:id').put(newsController.ActiveToInactiveReadyQueue)
router.route('/fetchall').get(newsController.fetchAllNews)
router.route('/users').get(paginatedResults("news"), paginationController)
router.route('/file/:fileName').get(newsController.getFiles)


module.exports = router;