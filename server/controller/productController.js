const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    res.status(200).json(Product.fetchAll());
}

exports.getProductById = (req, res, next) => {
    res.status(200).json(Product.findById(req.params.id));
}

exports.save = (req, res, next) => {
    const prod = req.body;
    const savedProd = new Product(null,prod.title, prod.price, prod.image, prod.stock).save();
    res.status(201).json(savedProd);
}

exports.update = (req, res, next) => {
    const prod = req.body;
    const updatedProd = new Product(prod.id, prod.title, prod.price, prod.image, prod.stock).update();
    res.status(200).json(updatedProd);
}
