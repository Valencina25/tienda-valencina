// Datos iniciales
const productosIniciales = [
    {id:1, name:"Miel Cruda de Azahar", category:"alimentacion", price:15.50, image:"imagenes/miel.jpg", producer:"Apicultura Los Alcores"},
    {id:2, name:"Aceite de Oliva Virgen Extra", category:"alimentacion", price:18.90, image:"imagenes/aceite.jpg", producer:"Almazara El Viso"},
    {id:3, name:"Crema Hidratante de Aloe Vera", category:"cosmetica", price:12.30, image:"imagenes/crema.jpg", producer:"Cosmética Natural Sevilla"},
    {id:4, name:"Jabón Artesanal de Lavanda", category:"cosmetica", price:6.50, image:"imagenes/jabon.jpg", producer:"Jabonería La Alpujarra"},
    {id:5, name:"Cerámica Decorativa Andaluza", category:"artesania", price:22.90, image:"imagenes/ceramica.jpg", producer:"Taller Alfarería Triana"},
    {id:6, name:"Mantel de Lino Natural", category:"textil", price:19.50, image:"imagenes/mantel.jpg", producer:"Textiles Artesanos del Sur"},
    {id:7, name:"Cesta de Mimbre Natural", category:"artesania", price:14.90, image:"imagenes/cesta.jpg", producer:"Cestería Tradicional"},
    {id:8, name:"Vela de Cera de Abeja", category:"decoracion", price:8.90, image:"imagenes/vela.jpg", producer:"Elaboración Propia"}
];

let products = JSON.parse(localStorage.getItem('tiendalocal_productos')) || [...productosIniciales];

export function guardarProductos(){ localStorage.setItem('tiendalocal_productos', JSON.stringify(products)) }
function generarId(){ return Math.max(...products.map(p=>p.id),0)+1 }

export function getProducts(){ return [...products] }
export function getProductById(id){ return products.find(p=>p.id===id) }
export function addProduct(p){ p.id=generarId(); products.push(p); guardarProductos(); return p }
export function updateProduct(id, datos){ const i=products.findIndex(p=>p.id===id); if(i!==-1){products[i]={...products[i],...datos}; guardarProductos(); return products[i]} return null }
export function deleteProduct(id){ const i=products.findIndex(p=>p.id===id); if(i!==-1){const e=products.splice(i,1)[0]; guardarProductos(); return e} return null }
export function resetProducts(){ products=[...productosIniciales]; guardarProductos(); return products }
