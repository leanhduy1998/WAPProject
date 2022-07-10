const products = {
    0: {
        name: 'Node.js',
        price: 9.99,
        image: 'https://nodejs.org/static/images/logo-hexagon-card.png',
        stock: 8
    },
    1: {
        id: 1,
        name: 'React.js',
        price: 19.99,
        image: 'https://dwglogo.com/wp-content/uploads/2017/09/1460px-React_logo.png',
        stock: 5
    },
    2: {
        id: 2,
        name: 'Angular',
        price: 29.99,
        image: 'https://angular.io/assets/images/logos/angularjs/AngularJS-Shield.svg',
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
        console.log(id);
        if (id in products) {
            return products[id]
        }
        return null
    }

    static fetchAll() {
        return products
    }
}