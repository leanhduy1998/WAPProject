const User = require("./model/user");

const user = module.require('../model/user');

validateToken((req, res, next) => {
    let token = req.header('x-auth-token')
    if (token === null) {
        next(new Error('Access denied'));
    } else if(!User.verifyToken(token)) {
        return next("Invalid token");
    }
    req.username = User.getUsernameFromToken(token)
    next()
})