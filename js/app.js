// =============================
// CONFIGURACIÓN ADMIN PROFESIONAL
// =============================
let isAdmin = false
const defaultPassword = "TuPasswordSegura123"
let ADMIN_PASSWORD = localStorage.getItem('tiendalocal_admin_pwd') || defaultPassword

// =============================
// IMPORTAR DATOS
// =============================
import { getProducts, addProduct, updateProduct, deleteProduct, resetProducts } from './data/products.js'

// =============================
// ELEMENTOS DEL DOM
// =============================
const productsGrid = document.getElementById('products-grid')
const featuredGrid = document.getElementById('featured-products')
const statProducts = document.getElementById('stat-products')
const cartEmpty = document.getElementById('cart-empty')
const cartContent = document.getElementById('cart-content')
const cartItemsContainer = document.getElementById('cart-items')
const cartSubtotalEl = document.getElementById('cart-subtotal')
const cartTotalEl = document.getElementById('cart-total')

// Admin
const productForm = document.getElementById('product-form')
const adminList = document.getElementById('admin-list')
const btnReset = document.getElementById('btn-reset')

// Formulario cambiar contraseña
const changePwdBtn = document.getElementById('btn-change-pwd')
const newPwdInput = document.getElementById('new-admin-pwd')

// =============================
// CARRITO
// =============================
let cart = JSON.parse(localStorage.getItem('tiendalocal_cart')) || []

function saveCart() {
    localStorage.setItem('tiendalocal_cart', JSON.stringify(cart))
    updateCartCount()
    renderCart()
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count')
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    if(cartCount) cartCount.textContent = totalItems
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id)
    if(existing) existing.quantity++
    else cart.push({ ...product, quantity: 1 })
    saveCart()
    // Mensaje animado
    const toast = document.createElement('div')
    toast.textContent = `✅ ${product.name} añadido`
    toast.className = 'toast'
    document.body.appendChild(toast)
    setTimeout(()=> toast.remove(),1500)
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart() }
function changeQuantity(id, qty) { const item = cart.find(i => i.id===id); if(item){item.quantity=Math.max(1,qty); saveCart()} }

// =============================
// RENDER PRODUCTOS
// =============================
function renderProducts() {
    const products = getProducts()
    productsGrid.innerHTML = products.map(p=>`
        <div class="product-card">
            <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
            <h3>${p.name}</h3>
            <p class="product-producer">${p.producer}</p>
            <p class="product-price">${p.price.toFixed(2)} €</p>
            <button class="btn btn-primary" data-id="${p.id}">Añadir al carrito</button>
        </div>
    `).join('')
    document.querySelectorAll('[data-id]').forEach(btn=> btn.addEventListener('click',()=> addToCart(getProducts().find(p=>p.id===parseInt(btn.getAttribute('data-id'))))))
}

// =============================
// RENDER DESTACADOS
// =============================
function renderFeatured() {
    const products = getProducts().slice(0,4)
    featuredGrid.innerHTML = products.map(p=>`
        <div class="product-card">
            <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
            <h3>${p.name}</h3>
            <p>${p.price.toFixed(2)} €</p>
        </div>
    `).join('')
}

// =============================
// RENDER CARRITO
// =============================
function renderCart() {
    if(cart.length===0){cartEmpty.style.display='block'; cartContent.style.display='none'; return}
    cartEmpty.style.display='none'; cartContent.style.display='block'

    cartItemsContainer.innerHTML = cart.map(i=>`
        <div class="cart-item">
            <div class="cart-img"><img src="${i.image}" alt="${i.name}"></div>
            <div class="cart-details">
                <h4>${i.name}</h4>
                <p>${i.price.toFixed(2)} €</p>
                <div class="cart-actions">
                    <input type="number" min="1" value="${i.quantity}" data-id="${i.id}" class="cart-qty">
                    <button class="btn btn-danger btn-remove" data-id="${i.id}">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('')

    document.querySelectorAll('.btn-remove').forEach(btn=> btn.addEventListener('click',()=>removeFromCart(parseInt(btn.getAttribute('data-id')))))
    document.querySelectorAll('.cart-qty').forEach(input=>input.addEventListener('change',()=>changeQuantity(parseInt(input.getAttribute('data-id')),parseInt(input.value))))

    const subtotal=cart.reduce((acc,i)=>acc+i.price*i.quantity,0)
    cartSubtotalEl.textContent=subtotal.toFixed(2)+' €'
    cartTotalEl.textContent=subtotal.toFixed(2)+' €'
}

// =============================
// ESTADÍSTICAS
// =============================
function updateStats() { if(statProducts) statProducts.textContent=getProducts().length }

// =============================
// ADMIN PANEL
// =============================
function renderAdminList() {
    if(!isAdmin){adminList.innerHTML=`<tr><td colspan="5">Acceso restringido</td></tr>`; return}

    adminList.innerHTML = getProducts().map(p=>`
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price.toFixed(2)} €</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${p.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>
    `).join('')

    document.querySelectorAll('.btn-edit').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const p=getProducts().find(pr=>pr.id===parseInt(btn.getAttribute('data-id')))
            if(p){
                document.getElementById('product-id').value=p.id
                document.getElementById('prod-name').value=p.name
                document.getElementById('prod-price').value=p.price
                document.getElementById('prod-category').value=p.category
                document.getElementById('prod-producer').value=p.producer
                document.getElementById('prod-image').value=p.image
            }
        })
    })

    document.querySelectorAll('.btn-delete').forEach(btn=> btn.addEventListener('click',()=>{
        deleteProduct(parseInt(btn.getAttribute('data-id')))
        renderAdminList(); renderProducts(); renderFeatured(); updateStats()
    }))
}

productForm.addEventListener('submit',e=>{
    e.preventDefault()
    if(!isAdmin) return alert("Solo admin puede añadir productos")
    const id=document.getElementById('product-id').value
    const name=document.getElementById('prod-name').value.trim()
    const price=parseFloat(document.getElementById('prod-price').value)
    const category=document.getElementById('prod-category').value
    const producer=document.getElementById('prod-producer').value.trim()
    const image=document.getElementById('prod-image').value.trim()
    if(!name||!price||!category||!producer||!image) return alert("Todos los campos son obligatorios")
    if(id) updateProduct(parseInt(id),{name,price,category,producer,image})
    else addProduct({name,price,category,producer,image})
    productForm.reset()
    document.getElementById('product-id').value=''
    renderAdminList(); renderProducts(); renderFeatured(); updateStats()
})

// Cambiar contraseña admin desde web
if(changePwdBtn){
    changePwdBtn.addEventListener('click',()=>{
        if(!isAdmin) return alert("Solo admin puede cambiar contraseña")
        const newPwd = newPwdInput.value.trim()
        if(!newPwd) return alert("Escribe una contraseña válida")
        ADMIN_PASSWORD=newPwd
        localStorage.setItem('tiendalocal_admin_pwd',newPwd)
        alert("Contraseña cambiada ✅")
        newPwdInput.value=''
    })
}

btnReset.addEventListener('click',()=>{
    if(!isAdmin) return alert("Solo admin puede resetear productos")
    if(confirm("¿Seguro que quieres resetear todos los productos?")){
        resetProducts(); renderAdminList(); renderProducts(); renderFeatured(); updateStats()
    }
})

// =============================
// NAVEGACIÓN SPA
// =============================
const navLinks=document.querySelectorAll('[data-nav]')
const sections=document.querySelectorAll('.section')

function showSection(id){
    sections.forEach(s=>s.classList.remove('active'))
    const target=document.getElementById(id)
    if(target) target.classList.add('active')
    navLinks.forEach(l=>l.classList.remove('active'))
    document.querySelectorAll(`[data-nav="${id}"]`).forEach(l=>l.classList.add('active'))

    if(id==='admin' && !isAdmin){
        const pwd=prompt("Introduce contraseña admin:")
        if(pwd===ADMIN_PASSWORD){isAdmin=true; alert("¡Bienvenido admin!")}
        else{alert("Contraseña incorrecta"); showSection('home')}
    }
}

navLinks.forEach(link=>link.addEventListener('click',e=>{ e.preventDefault(); showSection(link.getAttribute('data-nav')) }))

// =============================
// INICIALIZAR
// =============================
document.addEventListener('DOMContentLoaded',()=>{
    renderProducts(); renderFeatured(); renderCart(); renderAdminList(); updateStats(); updateCartCount()
})
