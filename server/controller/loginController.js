const User = require('../model/user');

exports.login = (req, res, next) => {
    const response = User.login(req.body.username,req.body.password)
    if(response.status === false) {
        res.status(401).json(response);
    } else {
        res.status(200).json(response);
    }
}