const express = require('express');
const productController = require('../controller/productController');
const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:prodId', productController.getProductById);
router.post('/', productController.save);
router.put('/:prodId', productController.update);

module.exports = router;