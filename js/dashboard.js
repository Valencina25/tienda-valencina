// =============================
// RENDER PRODUCTOS
// =============================
function renderProductos(category = 'todos') {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = category === 'todos'
    ? window.productos
    : window.productos.filter(p => p.categoria === category);

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Sin imagen</text></svg>'">
      </div>
      <span class="product-category">${capitalize(p.categoria)}</span>
      <h3>${p.nombre}</h3>
      <p class="product-producer">${p.productor}</p>
      <p class="product-price">${parseFloat(p.precio).toFixed(2)} €</p>
      <button class="btn btn-primary btn-add-cart" data-id="${p.id}">Añadir al carrito</button>
    </div>
  `).join('');
 
  container.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });

  renderCategoryFilters(category);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCategoryFilters(activeCategory = 'todos') {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const categories = [...new Set(window.productos.map(p => p.categoria))];

  container.innerHTML = `
    <button class="filter-btn ${activeCategory === 'todos' ? 'active' : ''}" data-category="todos">Todos</button>
    ${categories.map(cat => `
      <button class="filter-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">${capitalize(cat)}</button>
    `).join('')}
  `;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProductos(btn.dataset.category);
    });
  });
}

function renderDestacados() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const destacados = window.productos.slice(0, 4);
  container.innerHTML = destacados.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Sin imagen</text></svg>'">
      </div>
      <span class="product-category">${capitalize(p.categoria)}</span>
      <h3>${p.nombre}</h3>
      <p class="product-price">${parseFloat(p.precio).toFixed(2)} €</p>
    </div>
  `).join('');
}

function addToCart(id) {
  const producto = window.productos.find(p => p.id === id);
  if (producto) {
    window.addToCarrito(producto);
    updateCartCount();
    renderCarrito();
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
  
  const currentCarrito = window.carrito;
  
  if (currentCarrito.length === 0) {
    empty.style.display = 'block';
    content.style.display = 'none';
    return;
  }
  
  empty.style.display = 'none';
  content.style.display = 'block';
  
  itemsContainer.innerHTML = currentCarrito.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-img">
        <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%23f0f0f0%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22>?</text></svg>'">
      </div>
      <div class="cart-details">
        <h4>${item.nombre}</h4>
        <p>${parseFloat(item.precio).toFixed(2)} €</p>
        <div class="cart-actions">
          <input type="number" min="1" value="${item.cantidad}" class="cart-qty" data-id="${item.id}">
          <button class="btn btn-danger btn-sm btn-remove-cart" data-id="${item.id}">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');
  
  itemsContainer.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', (e) => updateCartItem(parseInt(e.target.dataset.id), parseInt(e.target.value)));
  });
  
  itemsContainer.querySelectorAll('.btn-remove-cart').forEach(btn => {
    btn.addEventListener('click', () => removeCartItem(parseInt(btn.dataset.id)));
  });
  
  const subtotal = currentCarrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' €';
  if (totalEl) totalEl.textContent = subtotal.toFixed(2) + ' €';
}

function updateCartItem(id, cantidad) {
  window.updateCantidadCarrito(id, parseInt(cantidad));
  renderCarrito();
  updateCartCount();
}

function removeCartItem(id) {
  window.removeFromCarrito(id);
  renderCarrito();
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    const currentCarrito = window.carrito;
    const total = currentCarrito.reduce((acc, item) => acc + item.cantidad, 0);
    countEl.textContent = total;
  }
}

// =============================
// PANEL ADMIN
// =============================
function renderAdminList() {
  const container = document.getElementById('admin-list');
  if (!container) return;
  
  container.innerHTML = window.productos.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${parseFloat(p.precio).toFixed(2)} €</td>
      <td>
        <button class="btn btn-primary btn-sm btn-edit-prod" data-id="${p.id}">Editar</button>
        <button class="btn btn-danger btn-sm btn-delete-prod" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
  
  container.querySelectorAll('.btn-edit-prod').forEach(btn => {
    btn.addEventListener('click', () => editProducto(parseInt(btn.dataset.id)));
  });
  
  container.querySelectorAll('.btn-delete-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Eliminar producto?')) {
        window.removeProducto(parseInt(btn.dataset.id));
        refreshAll();
        showToast('Producto eliminado');
      }
    });
  });
}

function editProducto(id) {
  const p = window.productos.find(prod => prod.id === id);
  if (!p) return;
  
  document.getElementById('product-id').value = p.id;
  document.getElementById('prod-name').value = p.nombre;
  document.getElementById('prod-price').value = p.precio;
  document.getElementById('prod-category').value = p.categoria;
  document.getElementById('prod-producer').value = p.productor;
  document.getElementById('prod-image').value = p.imagen.replace('imagenes/', '');
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';
}

function deleteProducto(id) {
  removeProducto(id);
  refreshAll();
  showToast('Producto eliminado');
}

function refreshAll() {
  renderProductos();
  renderDestacados();
  renderAdminList();
  updateStats();
  renderCategoryFilters();
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
  if (statEl) statEl.textContent = window.productos.length;
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
  
  if (sectionId === 'carrito') {
    renderCarrito();
    updateCartCount();
  }
  
  if (sectionId === 'admin') {
    const pwd = prompt('Introduce contraseña de admin:');
    if (pwd !== window.ADMIN_PASSWORD) {
      alert('Contraseña incorrecta');
      showSection('home');
      return;
    }
    renderAdminList();
    renderPedidos();
    updateAdminStats();
  }
}

// =============================
// ADMIN TABS
// =============================
function initAdminTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const content = document.getElementById('tab-' + tabId);
      if (content) content.classList.add('active');
      
      if (tabId === 'pedidos') renderPedidos();
      if (tabId === 'estadisticas') updateAdminStats();
    });
  });
}

// =============================
// PEDIDOS
// =============================
function finalizarCompra() {
  const currentCarrito = window.carrito;
  if (currentCarrito.length === 0) {
    showToast('El carrito está vacío');
    return;
  }
  
  openCheckoutModal();
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotal = document.getElementById('checkout-total');
  const pedidoNumero = document.getElementById('pedido-numero');
  
  if (!modal) return;
  
  const currentCarrito = window.carrito;
  const total = currentCarrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad),0);
  
  if (pedidoNumero) pedidoNumero.textContent = Date.now().toString().slice(-6);
  
  checkoutItems.innerHTML = `
    <div class="checkout-items-list">
      ${currentCarrito.map(item => `
        <div class="checkout-item-pro">
          <div class="checkout-item-info">
            <span class="checkout-item-name">${item.nombre}</span>
            <span class="checkout-item-qty">Cantidad: ${item.cantidad}</span>
          </div>
          <span class="checkout-item-price">${(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</span>
        </div>
      `).join('')}
    </div>
  `;
  
  checkoutTotal.textContent = total.toFixed(2) + ' €';
  modal.style.display = 'flex';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.style.display = 'none';
}

function confirmarPedido(clienteData) {
  const currentCarrito = window.carrito;
  const total = currentCarrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad),0);
  
  const pedido = {
    id: Date.now(),
    fecha: new Date().toLocaleString('es-ES'),
    cliente: clienteData,
    items: [...currentCarrito],
    total: total
  };
  
  let pedidos = JSON.parse(localStorage.getItem('tienda_pedidos') || '[]');
  pedidos.unshift(pedido);
  localStorage.setItem('tienda_pedidos', JSON.stringify(pedidos));
  
  window.clearCarrito();
  renderCarrito();
  updateCartCount();
  closeCheckoutModal();
  mostrarConfirmacion(pedido);
}

function mostrarConfirmacion(pedido) {
  const confirmModal = document.getElementById('confirm-modal');
  const confirmCliente = document.getElementById('confirm-cliente');
  const confirmPedidoId = document.getElementById('confirm-pedido-id');
  const confirmItems = document.getElementById('confirm-items');
  const confirmTotal = document.getElementById('confirm-total');
  
  if (!confirmModal) return;
  
  confirmPedidoId.textContent = pedido.id.toString().slice(-6);
  
  confirmCliente.innerHTML = `
    <div class="confirm-cliente-item"><strong>Nombre:</strong> <span>${pedido.cliente.nombre}</span></div>
    <div class="confirm-cliente-item"><strong>Teléfono:</strong> <span>${pedido.cliente.telefono}</span></div>
    <div class="confirm-cliente-item"><strong>Email:</strong> <span>${pedido.cliente.email}</span></div>
    <div class="confirm-cliente-item"><strong>Dirección:</strong> <span>${pedido.cliente.direccion}, ${pedido.cliente.ciudad}</span></div>
    ${pedido.cliente.notas ? `<div class="confirm-cliente-item"><strong>Notas:</strong> <span>${pedido.cliente.notas}</span></div>` : ''}
  `;
  
  confirmItems.innerHTML = pedido.items.map(item => `
    <div class="confirm-item">
      <span class="confirm-item-name">${item.nombre} x${item.cantidad}</span>
      <span class="confirm-item-price">${(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</span>
    </div>
  `).join('');
  
  confirmTotal.textContent = pedido.total.toFixed(2) + ' €';
  
  confirmModal.style.display = 'flex';
}

function cerrarConfirmacion() {
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) confirmModal.style.display = 'none';
}

function renderPedidos() {
  const container = document.getElementById('pedidos-list');
  if (!container) return;  
  
  const pedidos = JSON.parse(localStorage.getItem('tienda_pedidos') || '[]');
  
  if (pedidos.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No hay pedidos realizados</p></div>';
    return;
  }
  
  container.innerHTML = pedidos.map(p => `
    <div class="pedido-card" data-id="${p.id}">
      <div class="pedido-header">
        <span class="pedido-id">Pedido #${p.id.toString().slice(-6)}</span>
        <span class="pedido-fecha">${p.fecha}</span>
      </div>
      ${p.cliente ? `
        <div style="padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); font-size: 0.9rem;">
          <strong>${p.cliente.nombre}</strong><br>
          📞 ${p.cliente.telefono} | ✉️ ${p.cliente.email}<br>
          📍 ${p.cliente.direccion}, ${p.cliente.ciudad}
          ${p.cliente.notas ? `<br><em>Nota: ${p.cliente.notas}</em>` : ''}
        </div>
      ` : ''}
      <div class="pedido-items">
        ${p.items.map(item => `
          <div class="pedido-item">
            <span>${item.nombre} x${item.cantidad}</span>
            <span>${(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</span>
          </div>
        `).join('')}
      </div>
      <div class="pedido-header" style="margin-top: 0.5rem; border-top: none;">
        <span>Total</span>
        <span class="pedido-total">${p.total.toFixed(2)} €</span>
        <button class="btn btn-danger btn-sm btn-delete-pedido" data-id="${p.id}" style="margin-left: auto;">Eliminar</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-delete-pedido').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Eliminar este pedido?')) {
        window.removePedido(parseInt(btn.dataset.id));
        renderPedidos();
        updateAdminStats();
        showToast('Pedido eliminado');
      }
    });
  });
}

function updateAdminStats() {
  const pedidos = JSON.parse(localStorage.getItem('tienda_pedidos') || '[]');
  const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0);
  
  const statProductos = document.getElementById('stat-total-productos');
  const statPedidos = document.getElementById('stat-total-pedidos');
  const statVentas = document.getElementById('stat-total-ventas');
  
  if (statProductos) statProductos.textContent = window.productos.length;
  if (statPedidos) statPedidos.textContent = pedidos.length;
  if (statVentas) statVentas.textContent = totalVentas.toFixed(2) + ' €';
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
  
  // Tabs admin
  initAdminTabs();
  
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
        window.updateProducto(parseInt(id), producto);
        showToast('Producto actualizado');
      } else {
        window.addProducto(producto);
        showToast('Producto añadido');
      }
      
      productForm.reset();
      document.getElementById('product-id').value = '';
      document.getElementById('btn-cancel-edit').style.display = 'none';
      refreshAll();
    });
  }
  
  // Cancelar edición
  const btnCancel = document.getElementById('btn-cancel-edit');
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      document.getElementById('product-form').reset();
      document.getElementById('product-id').value = '';
      btnCancel.style.display = 'none';
    });
  }
  
  // Reset productos
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('¿Resetear todos los productos?')) {
        window.resetProductos();
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
        window.clearCarrito();
        renderCarrito();
        updateCartCount();
      }
    });
  }
  
  // Finalizar compra - abrir modal
  const btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', finalizarCompra);
  }
  
  // Cerrar modal
  const closeModal = document.getElementById('close-modal');
  const cancelCheckout = document.getElementById('cancel-checkout');
  if (closeModal) closeModal.addEventListener('click', closeCheckoutModal);
  if (cancelCheckout) cancelCheckout.addEventListener('click', closeCheckoutModal);
  
  // Click fuera del modal para cerrar
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }
  
  // Formulario checkout
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(checkoutForm);
      const clienteData = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad'),
        notas: formData.get('notas')
      };
      confirmarPedido(clienteData);
      checkoutForm.reset();
    });
  }
  
  // Formulario contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅ Mensaje enviado correctamente');
      contactForm.reset();
    });
  }

  // Cerrar confirmación y volver al inicio
  const btnVolver = document.getElementById('btn-volver-inicio');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      cerrarConfirmacion();
      showSection('home');
    });
  }
  
  // Cerrar modal confirmación al hacer click fuera
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        cerrarConfirmacion();
        showSection('home');
      }
    });
  }
  
  // Inicializar vistas
  renderProductos();
  renderDestacados();
  renderCarrito();
  updateCartCount();
  updateStats();
  renderCategoryFilters();
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
