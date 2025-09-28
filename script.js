// Mobile menu toggle
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Cart modal elements
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Cart data structure
let cart = {};

// Format price helper for INR with comma separators
function formatPrice(price) {
    // Convert number to string with Indian number format and prefix ₹
    return '₹' + price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update cart count badge
function updateCartCount() {
    const totalCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    if (totalCount === 0) {
        cartCount.classList.add('hidden');
    } else {
        cartCount.classList.remove('hidden');
    }
}

// Update cart total price
function updateCartTotal() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = 'Total: ' + formatPrice(total);
    checkoutButton.disabled = total === 0;
}

// Render cart items in modal
function renderCartItems() {
    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-700 text-center">Your cart is empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';
    for (const id in cart) {
        const item = cart[id];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center border-b border-gray-200 py-4 space-x-4';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name + ' product image';
        img.className = 'w-20 h-20 object-cover rounded-md flex-shrink-0';
        img.loading = 'lazy';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex-grow';

        const nameP = document.createElement('p');
        nameP.className = 'font-semibold text-gray-900';
        nameP.textContent = item.name;

        const priceP = document.createElement('p');
        priceP.className = 'text-indigo-600 font-bold';
        priceP.textContent = formatPrice(item.price);

        infoDiv.appendChild(nameP);
        infoDiv.appendChild(priceP);

        const qtyDiv = document.createElement('div');
        qtyDiv.className = 'flex items-center space-x-2';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'text-gray-600 hover:text-indigo-600 transition focus:outline-none';
        minusBtn.setAttribute('aria-label', 'Decrease quantity');
        minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                delete cart[id];
            }
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
        });

        const qtySpan = document.createElement('span');
        qtySpan.className = 'w-6 text-center font-semibold';
        qtySpan.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'text-gray-600 hover:text-indigo-600 transition focus:outline-none';
        plusBtn.setAttribute('aria-label', 'Increase quantity');
        plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
        plusBtn.addEventListener('click', () => {
            item.quantity++;
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
        });

        qtyDiv.appendChild(minusBtn);
        qtyDiv.appendChild(qtySpan);
        qtyDiv.appendChild(plusBtn);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-red-600 hover:text-red-800 transition focus:outline-none ml-4';
        removeBtn.setAttribute('aria-label', 'Remove item');
        removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        removeBtn.addEventListener('click', () => {
            delete cart[id];
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
        });

        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(qtyDiv);
        itemDiv.appendChild(removeBtn);

        cartItemsContainer.appendChild(itemDiv);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shopEaseCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shopEaseCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add to cart button handler
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const image = btn.dataset.image;

        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = { name, price, quantity: 1, image };
        }

        saveCart();
        updateCartCount();

        // Visual feedback
        btn.textContent = 'Added!';
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('bg-green-600');
        }, 1000);
    });
});

// Open cart modal
cartButton.addEventListener('click', () => {
    renderCartItems();
    updateCartTotal();
    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

// Close cart modal
closeCartButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
});

// Close cart modal on outside click
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Checkout button handler
checkoutButton.addEventListener('click', () => {
    alert('Thank you for your purchase! Your order has been placed.');
    cart = {};
    saveCart();
    renderCartItems();
    updateCartCount();
    updateCartTotal();
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
});

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Here you would normally send the data to a server
    alert(`Thank you, ${name}! Your message has been received. We will get back to you shortly.`);

    contactForm.reset();
});

// Initialize cart on page load
loadCart();
updateCartCount();