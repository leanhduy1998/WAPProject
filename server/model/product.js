let host = ""
let port = "4321"

const products = [
    {
        id: 0,
        name: 'Node.js',
        price: 10,
        image: null,
        stock: 5
    },
    {
        id: 1,
        name: 'React.js',
        price: 10,
        image: null,
        stock: 50
    },
    {
        id: 2,
        name: 'Angular',
        price: 10,
        image: null,
        stock: 15
    }
];

module.exports = class Product {
    constructor(id, name, price, image, stock) {
        this.id = products.length + 1
        this.name = name
        this.price = price
        this.image = image
        this.stock = stock
    }

    save() {
        this.id = Math.random().toString();
        products.push(this)
    }

    update() {
        let list = products.filter(p => p.id !== this.id)
        list.push(this)
        products = list
    }

    static findById(id) {
        let list = products.filter(p => p.id === id)
        if (list.length === 0) {
            return null
        }

        return list[0]
    }

    static fetchAll() {
        return products
    }
}