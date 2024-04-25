const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerControllers')

// routes
router.get('/', customerController.homepage)
router.get('/about', customerController.aboutPage)
router.get('/add', customerController.addCustomer)
router.post('/add', customerController.postCustomer)

router.get('/view/:id', customerController.view)
router.put('/edit/:id', customerController.editPost)
router.delete('/edit/:id', customerController.deleteCustomer)
router.get('/edit/:id', customerController.edit)

router.post('/search', customerController.searchController)


module.exports = router;
