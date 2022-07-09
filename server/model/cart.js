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
    constructor(id, name, price, username) {
        this.id = id
        this.name = name
        this.price = price
        this.quantity = 1
        this.username = username
    }

    save() {
        console.log(this);
        let username = this.username
        let id = this.id
        if (cart[username] === null) {
            cart[username] = {};
            cart[username][id] = {};
        } else if (cart[username][id] === null) {
                cart[username][id] = {};
                cart[username][id].push(this);
        } else {
            cart[username][this.id].quantity ++;
        }
        console.log("LOL");
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
    }
}