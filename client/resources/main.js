username = ''

window.onload = function () {
    updateUISignedOut()

    document.getElementById('loginBtn').onclick = function (event) {
        document.getElementById("username").value = 'AnhDuy'
        document.getElementById("password").value = 'DuyAnh'

        let username = document.getElementById('username').value
        let password = document.getElementById('password').value

        login(username, password)
    }

    document.getElementById('logoutBtn').onclick = function (event) {
        sessionStorage.setItem('token', null)
        updateUISignedOut()
        username = ''
    }
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
            // 'x-auth-token': sessionStorage.getItem('token')
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
        const cartIcon = document.createElement('i');
        cartIcon.className = "bi bi-cart-plus";
        cartIcon.dataset.id = prod.id;

        let addCartClicked = function (prod) {
            return function () {
                addToCart(id, prod);
            };
        };
        cartIcon.onclick = addCartClicked(prod);

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
    } else {
        document.getElementById('emptyCart').style.display = 'none'
        document.getElementById('cartTable').style.display = 'block'
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
        price.textContent = prod.price

        const total = document.createElement('td');
        total.textContent = prod.quantity * prod.price;

        const quantityDiv = document.createElement('div');
        quantityDiv.id = 'quantityBox'

        const minus = document.createElement('div');
        minus.textContent = '-'
        minus.id = "btn"
        const plus = document.createElement('div');
        plus.textContent = '+'
        plus.id = "btn"

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
        totalD.textContent = 'Total: ' + total
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
    renderProduct(products)
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
    renderCart(result);
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
        .then(cart => renderCart(cart));
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
        .then(cart => renderCart(cart));
}