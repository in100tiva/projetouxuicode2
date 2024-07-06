document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('add-product-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productsGrid = document.getElementById('products-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartMenu = document.getElementById('cart-menu');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');
    const paymentMethod = document.getElementById('payment-method');
    const cashOptions = document.getElementById('cash-options');
    const cashReceived = document.getElementById('cash-received');
    const calculateChange = document.getElementById('calculate-change');
    const changeAmount = document.getElementById('change-amount');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let change = 0;

    const saveProducts = () => localStorage.setItem('products', JSON.stringify(products));
    const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));

    const updateCartCount = () => {
        cartCount.textContent = cart.length;
    };

    const calculateCartTotal = () => {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        cartTotal.textContent = `Total: R$${total.toFixed(2)}`;
    };

    const renderProducts = () => {
        productsGrid.innerHTML = '';
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>R$${product.price.toFixed(2)}</p>
                <button data-index="${index}"><i class="fas fa-cart-plus"></i> Adicionar ao Carrinho</button>
            `;
            productsGrid.appendChild(productCard);
        });
    };

    const renderCart = () => {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                ${item.name} - R$${item.price.toFixed(2)}
                <button data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            cartItems.appendChild(cartItem);
        });
        calculateCartTotal();
    };

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        if (name && !isNaN(price)) {
            products.push({ name, price });
            saveProducts();
            renderProducts();
            productForm.reset();
        }
    });

    productsGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
            const index = e.target.closest('button').dataset.index;
            cart.push(products[index]);
            saveCart();
            renderCart();
            updateCartCount();
            cartMenu.classList.remove('hidden'); // Mantém o carrinho aberto ao adicionar item
        }
    });

    cartIcon.addEventListener('click', () => {
        cartMenu.classList.toggle('hidden');
    });

    document.body.addEventListener('click', (e) => {
        // Verifica se o clique foi fora do menu do carrinho e ícone do carrinho
        if (!cartMenu.contains(e.target) && e.target !== cartIcon && !cartIcon.contains(e.target)) {
            cartMenu.classList.add('hidden');
        }
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
            const index = e.target.closest('button').dataset.index;
            cart.splice(index, 1); // Remove o item do carrinho
            saveCart(); // Salva o estado atualizado do carrinho
            renderCart(); // Renderiza o carrinho novamente
            updateCartCount(); // Atualiza a contagem de itens no carrinho
            cartMenu.classList.remove('hidden'); // Mantém o carrinho aberto ao excluir item
        }
    });

    checkoutButton.addEventListener('click', () => {
        const payment = paymentMethod.value;
        const orderDetails = {
            cart,
            date: new Date().toLocaleString('pt-BR'),
            paymentMethod: payment,
            change: payment === 'cash' ? change : null
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        window.location.href = 'receipt.html';
    });

    paymentMethod.addEventListener('change', () => {
        if (paymentMethod.value === 'cash') {
            cashOptions.classList.remove('hidden');
        } else {
            cashOptions.classList.add('hidden');
        }
    });

    calculateChange.addEventListener('click', () => {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        const received = parseFloat(cashReceived.value);
        if (!isNaN(received) && received >= total) {
            change = received - total;
            changeAmount.textContent = `Troco: R$${change.toFixed(2)}`;
        } else {
            changeAmount.textContent = 'Quantia insuficiente';
        }
    });

    renderProducts();
    renderCart();
    updateCartCount();
});
    