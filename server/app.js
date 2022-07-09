const express = require('express');
const productRouter = require('./router/productRouter');
const cartRouter = require('./router/cartRouter');
const loginRouter = require('./router/loginRouter');
const authMiddleware = require('./authentication');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const User = require("./model/user");
validateToken = ((req, res, next) => {
    let token = req.header('x-auth-token')
    if (token === null) {
        next(new Error('Access denied'));
    } else if(!User.verifyToken(token)) {
        return next("Invalid token");
    }
    req.username = User.getUsernameFromToken(token)
    next()
})

app.use('/products', validateToken, productRouter);
app.use('/cart', validateToken, cartRouter);
app.use('/login', loginRouter);


app.use((req, res, next) => {
    res.status(404).json({ error: req.url + ' API not supported!' });
});

app.use((err, req, res, next) => {
    if (err.message === 'NOT Found') {
        res.status(404).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Something is wrong! Try later' });
    }
});

app.listen(4321, () => console.log('listening to 4321...'));