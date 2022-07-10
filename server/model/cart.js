let host = ""
let port = "4321"

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
        let id = this.id
        
        if (!(username in cart)) {
            cart[username] = {};
            cart[username][id] = this;
        } else if (!(id in cart[username])) {
            cart[username][id] = this
                
        } else {
            cart[username][id].quantity ++;
        }
        return cart[username]
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
        cart[this.username][this.id] = this
        return cart[username]
    }
}