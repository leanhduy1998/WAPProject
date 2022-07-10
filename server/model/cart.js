const Product = require('../model/product');
const cart = {
    // 'AnhDuy':
    //     {
    //         0: {
    //             name: 'Node.js',
    //             price: 10,
    //             quantity: 5,
    //         },
    //         1: {
    //             name: 'React.js',
    //             price: 10,
    //             quantity: 50,
    //         },
    //         2: {
    //             name: 'Angular',
    //             price: 10,
    //             quantity: 15,
    //         }
    //     }
}

const total = 0

module.exports = class Cart {
    constructor(id, name, quantity, price, username) {
        this.id = id
        this.name = name
        this.price = price
        this.quantity = quantity
        this.username = username
    }

    save() {
        let username = this.username
        var id = this.id

        if (!(username in cart)) {
            cart[username] = {};
            cart[username][id] = this;
        } else if (!(id in cart[username])) {
            cart[username][id] = this
        } else {
            cart[username][id].quantity++;
        }


        let availableStock = Product.findById(id).stock
        if (cart[username][id].quantity > availableStock) {
            cart[username][id].quantity = availableStock
        }
        return cart[username]
    }

    static getTotal(username) {
        let total = 0
        for (const [id, item] of Object.entries(cart[username])) {
            total = total + parseFloat(item.quantity) * parseFloat(item.price)
        }
        return Math.round(total * 100) / 100 
    }

    static fetchAll(username) {
        return cart[username] || []
    }

    static findById(username, id) {
        if (cart[username] === null) {
            return []
        }
        return cart[username][id]
    }

    update() {
        let username = this.username
        let id = this.id

        if (!(username in cart)) {
            cart[username] = {};
            cart[username][id] = this;
        } else if (!(id in cart[username])) {
            cart[username][id] = this
        } else {
            cart[username][id].quantity = this.quantity;
        }

        if (cart[username][id].quantity < 1) {
            delete cart[username][id]
        } else {
            let availableStock = Product.findById(id).stock
            if (cart[username][id].quantity > availableStock) {
                cart[username][id].quantity = availableStock
            }
        }
        return cart[username]
    }

    static placeOrder(username) {
        for (const [id, orderItem] of Object.entries(cart[username])) {
            let product = Product.findById(id)
            if (product.stock < orderItem.quantity) {
                return Error("Out Of Stock")
            }
            product.stock = product.stock - orderItem.quantity
        }

        delete cart[username]
    }
}