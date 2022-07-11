username = ''
cart = {}
products = {}

window.onload = function () {
    updateUISignedOut()

    document.getElementById('loginBtn').onclick = function (event) {
        document.getElementById("username").value = 'Duy1'
        document.getElementById("password").value = 'Duy1'

        let username = document.getElementById('username').value
        let password = document.getElementById('password').value

        login(username, password)
    }

    document.getElementById('logoutBtn').onclick = function (event) {
        logout()
    }

    document.getElementById('placeOrderBtn').onclick = function (event) {
        fetch('http://localhost:4321/cart/' + username + '/placeOrder', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            username: this.username
        })
    }).then(response => response.json())
    .then((response) => {
        console.log(response);
        if (response.status === false) {
            window.alert(response.error);
        } else {
            getCart(username)
            getProducts()
        }
    })
    }
}

function logout() {
    sessionStorage.setItem('token', null)
    updateUISignedOut()
    delete username
    delete cart
    delete product
}

function updateUISignedOut() {
    document.getElementById('mainView').style.display = 'none'
    document.getElementById('welcomeUser').style.display = 'none'
    document.getElementById('loginBtn').style.display = 'block'
    document.getElementById('logoutBtn').style.display = 'none'
    document.getElementById('loginForms').style.display = 'block'
    document.getElementById('welcome').style.display = 'block'
    document.getElementById('headerDivider').style.display = 'block'
}

function updateUISignedIn(username) {
    document.getElementById('mainView').style.display = 'block'
    document.getElementById('welcome').style.display = 'none'
    document.getElementById('loginForms').style.display = 'none'

    document.getElementById('welcomeUser').style.display = 'block'
    document.getElementById('welcomeUser').innerHTML = 'Welcome ' + username

    document.getElementById('loginBtn').style.display = 'none'
    document.getElementById('logoutBtn').style.display = 'block'

    document.getElementById('headerDivider').style.display = 'none'
}

async function login(username, password) {
    let loginResponse = await fetch('http://localhost:4321/login/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }).then(response => response.json());
    handleLoginResponse(loginResponse)
}

function handleLoginResponse(res) {
    if (res.status === true) {
        username = res.username
        sessionStorage.setItem('token', res.token)
        updateUISignedIn(res.username)

        getProducts();
        getCart(res.username);
    } else {
        logout()
        console.log(res);
        window.alert(res.error);
    }
}

function renderProduct(products) {
    const table = document.getElementById('productTable');
    table.innerHTML = '';
    const body = document.createElement('tbody');
    table.appendChild(body)

    const headerRow = document.createElement('tr');
    const nameH = document.createElement('th');
    nameH.textContent = "Name";
    const priceH = document.createElement('th');
    priceH.textContent = "Price";
    const imageH = document.createElement('th');
    imageH.textContent = "Image";
    const stockH = document.createElement('th');
    stockH.textContent = "Stock";
    const actionH = document.createElement('th');
    actionH.textContent = "Actions";
    headerRow.appendChild(nameH)
    headerRow.appendChild(priceH)
    headerRow.appendChild(imageH)
    headerRow.appendChild(stockH)
    headerRow.appendChild(actionH)
    body.appendChild(headerRow);

    for (const [id, prod] of Object.entries(products)) {
        const tableRow = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = prod.name;

        const price = document.createElement('td');
        price.textContent = prod.price

        const image = document.createElement('td');
        const img = document.createElement('img');
        img.src = prod.image;
        img.height = 50;
        image.appendChild(img);
        image.style.textAlign = 'center';

        const stock = document.createElement('td');
        stock.textContent = prod.stock;

        const actions = document.createElement('td');
        const cartIcon = document.createElement('button');
        cartIcon.className = "bi bi-cart-plus";

        let addCartClicked = function (prod) {
            return function () {
                addToCart(id, prod);
            };
        };
        cartIcon.onclick = addCartClicked(prod);

        if(id in products) {
            if(this.products[id].stock === 0) {
                cartIcon.disabled = true
            } else {
                cartIcon.disabled = false
            }
        } else {
            cartIcon.disabled = false
        }

        cartIcon.style.fontSize = '2rem';
        actions.appendChild(cartIcon);
        actions.style.textAlign = 'center';

        tableRow.appendChild(name);
        tableRow.appendChild(price);
        tableRow.appendChild(image);
        tableRow.appendChild(stock);
        tableRow.appendChild(actions);
        body.appendChild(tableRow);
    };
}

async function renderCart(cartItems) {
    var total = 0
    let count = Object.keys(cartItems).length
    if (count > 0) {
        total = await fetch('http://localhost:4321/cart/' + username + '/total/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
        }).then(response => response.json());
    }

    if (count === 0) {
        document.getElementById('emptyCart').style.display = 'block'
        document.getElementById('cartTable').style.display = 'none'
        document.getElementById('placeOrderBtn').style.display = 'none'
    } else {
        document.getElementById('emptyCart').style.display = 'none'
        document.getElementById('cartTable').style.display = 'block'
        document.getElementById('placeOrderBtn').style.display = 'block'
    }

    const table = document.getElementById('cartTable');
    table.innerHTML = '';
    table.style.display = 'table'
    table.style.width = '100%'

    const body = document.createElement('tbody');
    table.appendChild(body)

    if (count > 0) {
        const headerRow = document.createElement('tr');
        const nameH = document.createElement('th');
        nameH.textContent = "Name";
        const priceH = document.createElement('th');
        priceH.textContent = "Price";
        const totalH = document.createElement('th');
        totalH.textContent = "Total";
        const quantityH = document.createElement('th');
        quantityH.textContent = "Quantity";

        headerRow.appendChild(nameH);
        headerRow.appendChild(priceH);
        headerRow.appendChild(totalH);
        headerRow.appendChild(quantityH);
        body.appendChild(headerRow);
    }

    for (const [id, prod] of Object.entries(cartItems)) {
        const tableRow = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = prod.name;

        const price = document.createElement('td');
        price.textContent = '$'+ Math.round(prod.price * 100) / 100 

        const total = document.createElement('td');
        total.textContent = '$'+ Math.round(prod.quantity * prod.price * 100) / 100;

        const quantityDiv = document.createElement('div');
        quantityDiv.id = 'quantityBox'

        const minus = document.createElement('button');
        minus.innerHTML = '-'
        minus.id = "btn"
        if(id in products && this.products[id].stock === 0) {
            minus.disabled = true
        } else {
            minus.disabled = false
        }

        const plus = document.createElement('button');
        plus.innerHTML = '+'
        plus.id = "btn"

        if(id in products && id in cart) {
            if(this.products[id].stock <= this.cart[id].quantity) {
                plus.disabled = true
            } else {
                plus.disabled = false
            }
        } else {
            plus.disabled = false
        }
        

        minus.onclick = function (item) {
            return function () {
                item.quantity--;
                updateCart(item)
            };
        }(prod)

        plus.onclick = function (item) {
            return function () {
                item.quantity++;
                updateCart(item)
            };
        }(prod)

        quantityDiv.appendChild(minus)
        const quantity = document.createElement('td');
        quantity.textContent = prod.quantity;

        quantityDiv.appendChild(quantity)
        quantityDiv.appendChild(plus)

        tableRow.appendChild(name);
        tableRow.appendChild(price);
        tableRow.appendChild(total);
        tableRow.appendChild(quantityDiv);
        body.appendChild(tableRow);
    }

    if (count > 0) {
        const totalFoot = document.createElement('tfoot');
        const totalRow = document.createElement('tr');
        const totalD = document.createElement('td');
        totalD.colSpan = 4;
        totalD.textContent = 'Total: $' + total
        totalD.style.textAlign = 'right'

        totalRow.appendChild(totalD);
        totalFoot.appendChild(totalRow)
        table.appendChild(totalFoot);
    }
}

async function getProducts() {
    let products = await fetch('http://localhost:4321/products/', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    }).then(response => response.json());
    if (products.status !== false) {
        this.products = products
        renderProduct(products)
    } else {
        logout()
        window.alert(products.error);
    }
}

async function addToCart(id, product) {
    let result = await fetch('http://localhost:4321/cart/' + username, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: id,
            name: product.name,
            price: product.price,
            username: username
        })
    }).then(res => res.json())
    if(result.status === false) {
        logout()
        window.alert(result.error);
    } else {
        this.cart = result
        renderCart(result);
    }
}

async function getCart(username) {
    fetch('http://localhost:4321/cart/' + username, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    })
        .then(response => response.json())
        .then(cart => {
            if (cart.status !== false) {
                this.cart = cart
                renderCart(cart)
            } else {
                logout()
                window.alert(cart.error);
            }
        });
}

function updateCart(item) {
    fetch('http://localhost:4321/cart/' + username, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            username: item.username
        })
    }).then(response => response.json())
    .then(cart => {
        if (cart.status !== false) {
            this.cart = cart
            renderCart(cart)
        } else {
            logout()
            window.alert(cart.error);
        }
    });
}