const express = require("express")
const {addCategory,viewListItem,deleteItem, updateCategory,fetchAllCategoryData,fetchSubtype} = require("../controllers/category-controller")
const { paginatedResults, paginationController } = require("../controllers/pagination-controller")
const router = express.Router()


router.route('/add').post(addCategory)
// router.route('/add/:id').post(addCategory)
router.route('/view/:id').get(viewListItem)
router.route('/update/:id').put(updateCategory)
router.route('/users').get(paginatedResults("category-type"), paginationController)
router.route('/delete/:id').delete(deleteItem)
router.route('/fetchAll').get(fetchAllCategoryData)
router.route('/subcategory').get(fetchSubtype)



module.exports = router;