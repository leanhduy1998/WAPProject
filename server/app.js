const express = require('express');
const productRouter = require('./router/productRouter');
const cartRouter = require('./router/cartRouter');
const loginRouter = require('./router/loginRouter');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const User = require("./model/user");
validateToken = ((req, res, next) => {
    let token = req.header('x-auth-token')
    if (token === null) {
        next({message: 'Access denied', status: false});
    } else if(!User.verifyToken(token)) {
        return next({message: 'Invalid token', status: false});
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
        res.status(404).json({ status: false, error: err.message });
    } else if (err.message === 'Invalid token') {
        res.status(401).json({ status: false, error: err.message });
    } else {
        res.status(500).json({ status: false, error: 'Something is wrong! Try later' });
    }
});



app.listen(4321, () => console.log('listening to 4321...'));