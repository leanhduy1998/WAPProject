const express = require('express');
const cartController = require('../controller/cartController');
const router = express.Router();

router.get('/:username', cartController.getCartItems);
router.post('/:username/placeOrder', cartController.placeOrder);
router.get('/:username/total', cartController.getTotal);
router.get('/:username/:id', cartController.findById);
router.post('/:username', cartController.save);
router.put('/:username', cartController.update);

module.exports = router;