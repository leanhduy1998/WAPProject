const express = require('express');
const cartController = require('../controller/cartController');
const router = express.Router();

router.get('/:username', cartController.getCartItems);
router.get('/:username/:id', cartController.findById);
router.post('/', cartController.save);
router.put('/:username', cartController.update);

module.exports = router;