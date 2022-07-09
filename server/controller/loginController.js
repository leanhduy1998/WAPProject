const User = require('../model/user');

exports.login = (req, res, next) => {
    res.status(200).json(User.login(req.body.username,req.body.password));
}