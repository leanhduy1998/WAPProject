let host = ""
let port = "4321"

const cart = {
    'Anh Duy':
        [
            {
                id: 0,
                name: 'Node.js',
                price: 10,
                quantity: 5,
                username: 'Anh Duy'
            },
            {
                id: 1,
                name: 'React.js',
                price: 10,
                quantity: 50,
                username: 'Anh Duy'
            },
            {
                id: 2,
                name: 'Angular',
                price: 10,
                quantity: 15,
                username: 'Anh Duy'
            }
        ]
}

const total = 0

module.exports = class Cart {
    constructor(id, name, price, quantity, username) {
        this.id = id
        this.name = name
        this.price = price
        this.quantity = quantity
        this.username = username
    }

    save() {
        if (cart[this.username] === null) {
            cart[username] = [this];
        } else {
            cart[this.username].push(this);
        }
    }

    static fetchAll(username) {
        return cart.filter(([k, v]) => k === username)
    }

    static findById(username, id) {
        let userCart = cart.filter(([k, v]) => k === username)

        let list = userCart.filter(p => p.id === id)
        if (list.length === 0) {
            return null
        }

        return list[0]
    }

    update() {
        let userCart = cart.filter(([k, v]) => k === this.username)
        let list = userCart.filter(p => p.id !== this.id)
        list.push(this)
        cart[this.username] = list
    }
}