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
            'x-auth-token': sessionStorage.getItem('token')
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
        sessionStorage.setItem('token', res.token)
        updateUISignedIn(res.username)

        getProducts();
        getCart(res.username);
    }
}

function renderProduct(products) {
    const table = document.getElementById('productTable');
    table.innerHTML = '';

    products.forEach(prod => {
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
                console.log(prod);
                addToCart(prod);
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
        table.appendChild(tableRow);
    });
}

function renderCart(cartItems) {
    console.log(cartItems);
    if (Object.keys(cartItems).length === 0) {
        document.getElementById('emptyCart').style.display = 'block'
        document.getElementById('cartTable').style.display = 'none'
    } else {
        document.getElementById('emptyCart').style.display = 'none'
        document.getElementById('cartTable').style.display = 'block'
    }

    const table = document.getElementById('cartTable');
    table.innerHTML = '';

    for (const [id, prod] of Object.entries(cartItems)) {
        const tableRow = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = prod.name;

        const price = document.createElement('td');
        price.textContent = prod.price

        const total = document.createElement('td');
        total.textContent = prod.quantity * prod.price;

        const quantity = document.createElement('td');
        quantity.textContent = prod.quantity;

        tableRow.appendChild(name);
        tableRow.appendChild(price);
        tableRow.appendChild(total);
        tableRow.appendChild(quantity);
        table.appendChild(tableRow);
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

async function addToCart(product) {
    let result = await fetch('http://localhost:4321/cart/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
        })
    }).then(res => res.json());
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

function editProduct() {
    const prodId = document.getElementById('product-btn').dataset.id;
    const title = document.getElementById('title').value;
    const isbn = document.getElementById('isbn').value;
    const publishedDate = document.getElementById('publishedDate').value;
    const author = document.getElementById('author').value;
    fetch('http://localhost:3000/books/' + prodId, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            isbn: isbn,
            publishedDate: publishedDate,
            author: author
        })
    }).then(response => response.json())
        .then(jsonObj => {
            const productDiv = document.getElementById(prodId);
            productDiv.querySelector('h2').textContent = title;
            const paragraphArr = productDiv.querySelectorAll('p');
            paragraphArr[0].textContent = isbn;
            paragraphArr[1].textContent = publishedDate;
            paragraphArr[2].textContent = author;

            document.getElementById('product-heading').textContent = 'Add a new Book';
            document.getElementById('product-btn').dataset.id = '';
            document.getElementById('product-form').reset();
        });
}