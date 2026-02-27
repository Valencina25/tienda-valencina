const ADMIN_PASSWORD = "tienda2024";

const PRODUCTOS_DEFAULT = [
  { id: 1, nombre: "Miel Cruda de Azahar", categoria: "alimentacion", precio: 15.50, imagen: "imagenes/aguacate.jpg", productor: "Apiculture Los Alcores" },
  { id: 2, nombre: "Aceite de Oliva Virgen Extra", categoria: "alimentacion", precio: 18.90, imagen: "imagenes/botijo.jpg", productor: "Almazara El Viso" },
  { id: 3, nombre: "Crema Hidratante Aloe Vera", categoria: "cosmetica", precio: 12.30, imagen: "imagenes/aguacate.jpg", productor: "Cosmética Natural Sevilla" },
  { id: 4, nombre: "Jabón Artesanal de Lavanda", categoria: "cosmetica", precio: 6.50, imagen: "imagenes/botijo.jpg", productor: "Jabonería La Alpujarra" },
  { id: 5, nombre: "Cebollas", categoria: "alimentacion", precio: 2.50, imagen: "imagenes/cebolla.jpg", productor: "Hortalizas Local" },
  { id: 6, nombre: "Tomates", categoria: "alimentacion", precio: 3.00, imagen: "imagenes/tomate.jpg", productor: "Hortalizas Local" },
  { id: 7, nombre: "Pimientos", categoria: "alimentacion", precio: 2.80, imagen: "imagenes/pimiento.jpg", productor: "Hortalizas Local" },
  { id: 8, nombre: "Berenjenas", categoria: "alimentacion", precio: 2.20, imagen: "imagenes/berejena.jpg", productor: "Hortalizas Local" }
];

let productos = [];
let carrito = [];

function initData() {
  const stored = localStorage.getItem('tienda_productos');
  productos = stored ? JSON.parse(stored) : [...PRODUCTOS_DEFAULT];
  
  if (!stored) {
    localStorage.setItem('tienda_productos', JSON.stringify(productos));
  }
  
  window.productos = productos;
  carrito = JSON.parse(localStorage.getItem('tienda_carrito')) || [];
}

function saveProductos() {
  localStorage.setItem('tienda_productos', JSON.stringify(productos));
}

function saveCarrito() {
  localStorage.setItem('tienda_carrito', JSON.stringify(carrito));
}

function addProducto(producto) {
  producto.id = Date.now();
  if (producto.imagen && !producto.imagen.startsWith('http') && !producto.imagen.startsWith('data:')) {
    producto.imagen = 'imagenes/' + producto.imagen;
  }
  productos.push(producto);
  saveProductos();
  window.productos = productos;
  return producto;
}

function updateProducto(id, data) {
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    if (data.imagen && !data.imagen.startsWith('http') && !data.imagen.startsWith('data:') && !data.imagen.startsWith('imagenes/')) {
      data.imagen = 'imagenes/' + data.imagen;
    }
    productos[index] = { ...productos[index], ...data };
    saveProductos();
    window.productos = productos;
    return productos[index];
  }
  return null;
}

function removeProducto(id) {
  productos = productos.filter(p => p.id !== id);
  saveProductos();
  window.productos = productos;
}

function resetProductos() {
  productos = [...PRODUCTOS_DEFAULT];
  saveProductos();
  window.productos = productos;
}

function addToCarrito(producto) {
  const existing = carrito.find(item => item.id === producto.id);
  if (existing) {
    existing.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  saveCarrito();
}

function removeFromCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  saveCarrito();
}

function updateCantidadCarrito(id, cantidad) {
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad = Math.max(1, cantidad);
    saveCarrito();
  }
}

function clearCarrito() {
  carrito = [];
  saveCarrito();
}

initData();

window.productos = productos;
window.carrito = carrito;
window.addProducto = addProducto;
window.updateProducto = updateProducto;
window.removeProducto = removeProducto;
window.resetProductos = resetProductos;
window.addToCarrito = addToCarrito;
window.removeFromCarrito = removeFromCarrito;
window.updateCantidadCarrito = updateCantidadCarrito;
window.clearCarrito = clearCarrito;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;
