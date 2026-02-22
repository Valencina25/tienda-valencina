import { showToast, formatPrice } from '../utils/helpers.js';

let cart = JSON.parse(localStorage.getItem('tiendalocal_cart')) || [];

function saveCart() {
    localStorage.setItem('tiendalocal_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

export function initCart() {
    updateCartUI();
}

export function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showToast(`${product.name} añadido al carrito`);
}

export function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return false;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return false;
    }

    saveCart();
    return true;
}

export function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

export function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function clearCart() {
    cart = [];
    saveCart();
}

export function renderCart() {
    const emptyEl = document.getElementById('cart-empty');
    const contentEl = document.getElementById('cart-content');
    const itemsEl = document.getElementById('cart-items');

    if (cart.length === 0) {
        emptyEl.style.display = 'block';
        contentEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = 'block';

    itemsEl.innerHTML = cart.map(item => {
        const imgHtml = item.image
            ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="emoji-fallback" style="display:none">${item.emoji}</div>`
            : `<div class="emoji-fallback">${item.emoji}</div>`;

        return `
            <div class="cart-item">
                ${imgHtml}
                <div>
                    <h4>${item.name}</h4>
                    <p style="color:#666;font-size:0.9rem;">${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn-quantity" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-quantity" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <p style="font-weight:bold;color:var(--color-primary);">${formatPrice(item.price * item.quantity)}</p>
                <button class="btn-remove" data-id="${item.id}">🗑️</button>
            </div>
        `;
    }).join('');

    // Event listeners
    itemsEl.querySelectorAll('.btn-quantity').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const change = btn.dataset.action === 'increase' ? 1 : -1;
            if (updateQuantity(id, change)) {
                renderCart();
            } else {
                renderCart();
            }
        });
    });

    itemsEl.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
            renderCart();
            showToast('Producto eliminado del carrito');
        });
    });

    document.getElementById('cart-subtotal').textContent = formatPrice(getCartTotal());
    document.getElementById('cart-total').textContent = formatPrice(getCartTotal());
}
