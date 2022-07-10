const Cart = require('../model/cart');

exports.getCartItems = (req, res, next) => {
    res.status(200).json(Cart.fetchAll(req.params.username));
}

exports.findById = (req, res, next) => {
    res.status(200).json(Cart.findById(req.params.username,req.params.id));
}

exports.save = (req, res, next) => {
    const prod = req.body;
    console.log(prod);
    const savedItem = new Cart(prod.id,prod.name, 1, prod.price, prod.username).save();
    res.status(201).json(savedItem);
}

exports.update = (req, res, next) => {
    const prod = req.body;
    const updatedProd = new Cart(prod.id, prod.name, prod.quantity, prod.price, prod.username).update();
    res.status(200).json(updatedProd);
}
