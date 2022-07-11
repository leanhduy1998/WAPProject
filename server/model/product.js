const products = {
    0: {
        name: 'Node.js',
        price: 9.99,
        image: '/assets/node.png',
        stock: 8
    },
    1: {
        id: 1,
        name: 'React.js',
        price: 19.99,
        image: '/assets/react.png',
        stock: 5
    },
    2: {
        id: 2,
        name: 'Angular',
        price: 29.99,
        image: '/assets/angular.png',
        stock: 13
    }
};

module.exports = class Product {
    constructor(id, name, price, image, stock) {
        this.id = id
        this.name = name
        this.price = price
        this.image = image
        this.stock = stock
    }

    static findById(id) {
        if (id in products) {
            return products[id]
        }
        return null
    }

    static fetchAll() {
        return products
    }
}