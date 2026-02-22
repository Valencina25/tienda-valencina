import { getProducts, getProductById } from '../data/products.js';
import { getCategoryName, formatPrice } from '../utils/helpers.js';
import { addToCart } from './cart.js';

export function renderProducts(container, filter = 'all', limit = null) {
    let products = getProducts();

    if (filter !== 'all') {
        products = products.filter(p => p.category === filter);
    }

    if (limit) {
        products = products.slice(0, limit);
    }

    container.innerHTML = products.map(p => createProductCard(p)).join('');

    // Event listeners
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const product = getProductById(id);
            if (product) addToCart(product);
        });
    });
}

function createProductCard(product) {
    const imgHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'placeholder\\'>${product.emoji}</div>';">`
        : `<div class="placeholder">${product.emoji}</div>`;

    return `
        <article class="product-card">
            <div class="product-actions">
                <button class="btn-action btn-edit" data-id="${product.id}" title="Editar">✏️</button>
                <button class="btn-action btn-delete" data-id="${product.id}" title="Eliminar">🗑️</button>
            </div>
            <div class="product-image">
                ${imgHtml}
            </div>
            <div class="product-info">
                <span class="category">${getCategoryName(product.category)}</span>
                <h3>${product.name}</h3>
                <p class="producer">🌿 ${product.producer}</p>
                <p class="price">${formatPrice(product.price)}</p>
                <button class="btn btn-primary btn-add-cart" data-id="${product.id}">Añadir al Carrito</button>
            </div>
        </article>
    `;
}

export function createFilters(container) {
    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'alimentacion', name: 'Alimentación' },
        { id: 'cosmetica', name: 'Cosmética' },
        { id: 'artesania', name: 'Artesanía' },
        { id: 'textil', name: 'Textil' },
        { id: 'decoracion', name: 'Decoración' }
    ];

    container.innerHTML = categories.map(cat => `
