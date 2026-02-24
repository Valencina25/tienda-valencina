// =============================
// RENDER PRODUCTOS
// =============================
function renderProductos() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  container.innerHTML = productos.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Sin imagen</text></svg>'">
      </div>
      <h3>${p.nombre}</h3>
      <p class="product-producer">${p.productor}</p>
      <p class="product-price">${parseFloat(p.precio).toFixed(2)} €</p>
      <button class="btn btn-primary" onclick="addToCart(${p.id})">Añadir al carrito</button>
    </div>
  `).join('');
}

function renderDestacados() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const destacados = productos.slice(0, 4);
  container.innerHTML = destacados.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Sin imagen</text></svg>'">
      </div>
      <h3>${p.nombre}</h3>
      <p class="product-price">${parseFloat(p.precio).toFixed(2)} €</p>
    </div>
  `).join('');
}

function addToCart(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    addToCarrito(producto);
    updateCartCount();
    showToast(`✅ ${producto.nombre} añadido al carrito`);
  }
}

// =============================
// RENDER CARRITO
// =============================
function renderCarrito() {
  const empty = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');
  const itemsContainer = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!empty || !content) return;
  
  if (carrito.length === 0) {
    empty.style.display = 'block';
    content.style.display = 'none';
    return;
  }
  
  empty.style.display = 'none';
  content.style.display = 'block';
  
  itemsContainer.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <div class="cart-img">
        <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%23f0f0f0%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22>?</text></svg>'">
      </div>
      <div class="cart-details">
        <h4>${item.nombre}</h4>
        <p>${parseFloat(item.precio).toFixed(2)} €</p>
        <div class="cart-actions">
          <input type="number" min="1" value="${item.cantidad}" onchange="updateCartItem(${item.id}, this.value)" class="cart-qty">
          <button class="btn btn-danger btn-sm" onclick="removeCartItem(${item.id})">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');
  
  const subtotal = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
  subtotalEl.textContent = subtotal.toFixed(2) + ' €';
  totalEl.textContent = subtotal.toFixed(2) + ' €';
}

function updateCartItem(id, cantidad) {
  updateCantidadCarrito(id, parseInt(cantidad));
  renderCarrito();
  updateCartCount();
}

function removeCartItem(id) {
  removeFromCarrito(id);
  renderCarrito();
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    countEl.textContent = total;
  }
}

// =============================
// PANEL ADMIN
// =============================
function renderAdminList() {
  const container = document.getElementById('admin-list');
  if (!container) return;
  
  container.innerHTML = productos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${parseFloat(p.precio).toFixed(2)} €</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="editProducto(${p.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProducto(${p.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function editProducto(id) {
  const p = productos.find(prod => prod.id === id);
  if (!p) return;
  
  document.getElementById('product-id').value = p.id;
  document.getElementById('prod-name').value = p.nombre;
  document.getElementById('prod-price').value = p.precio;
  document.getElementById('prod-category').value = p.categoria;
  document.getElementById('prod-producer').value = p.productor;
  document.getElementById('prod-image').value = p.imagen.replace('imagenes/', '');
}

function deleteProducto(id) {
  if (confirm('¿Eliminar producto?')) {
    removeProducto(id);
    refreshAll();
    showToast('Producto eliminado');
  }
}

function refreshAll() {
  renderProductos();
  renderDestacados();
  renderAdminList();
  updateStats();
}

// =============================
// TOAST NOTIFICATIONS
// =============================
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// =============================
// ESTADÍSTICAS
// =============================
function updateStats() {
  const statEl = document.getElementById('stat-products');
  if (statEl) statEl.textContent = productos.length;
}

// =============================
// NAVEGACIÓN SPA
// =============================
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('[data-nav]').forEach(l => l.classList.remove('active'));
  
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll(`[data-nav="${sectionId}"]`).forEach(l => l.classList.add('active'));
  
  if (sectionId === 'admin') {
    const pwd = prompt('Introduce contraseña de admin:');
    if (pwd !== ADMIN_PASSWORD) {
      alert('Contraseña incorrecta');
      showSection('home');
      return;
    }
    renderAdminList();
  }
}

// =============================
// INICIALIZAR
// =============================
document.addEventListener('DOMContentLoaded', () => {
  // Navegación
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.nav);
    });
  });
  
  // Formulario productos admin
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('product-id').value;
      const producto = {
        nombre: document.getElementById('prod-name').value,
        precio: parseFloat(document.getElementById('prod-price').value),
        categoria: document.getElementById('prod-category').value,
        productor: document.getElementById('prod-producer').value,
        imagen: document.getElementById('prod-image').value
      };
      
      if (id) {
        updateProducto(parseInt(id), producto);
        showToast('Producto actualizado');
      } else {
        addProducto(producto);
        showToast('Producto añadido');
      }
      
      productForm.reset();
      document.getElementById('product-id').value = '';
      refreshAll();
    });
  }
  
  // Reset productos
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('¿Resetear todos los productos?')) {
        resetProductos();
        refreshAll();
        showToast('Productos reseteados');
      }
    });
  }
  
  // Vaciar carrito
  const btnClearCart = document.getElementById('btn-clear-cart');
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (confirm('¿Vaciar carrito?')) {
        clearCarrito();
        renderCarrito();
        updateCartCount();
      }
    });
  }
  
  // Inicializar vistas
  renderProductos();
  renderDestacados();
  renderCarrito();
  updateCartCount();
  updateStats();
});

window.renderProductos = renderProductos;
window.renderDestacados = renderDestacados;
window.renderCarrito = renderCarrito;
window.updateCartCount = updateCartCount;
window.showToast = showToast;
window.renderAdminList = renderAdminList;
window.refreshAll = refreshAll;
window.editProducto = editProducto;
window.deleteProducto = deleteProducto;
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem;
window.showSection = showSection;
