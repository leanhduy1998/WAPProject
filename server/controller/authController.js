const User = require('../model/user');

exports.login = (req, res, next) => {
    res.status(200).json(Cart.findById(req.params.username,req.params.id));
}