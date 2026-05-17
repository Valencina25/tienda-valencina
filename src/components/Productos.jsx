import { useState, useMemo } from 'react'
import { useStore } from '../context/StoreContext'

export default function Productos() {
  const { productos, addToCarrito, showToast } = useStore()
  const [category, setCategory] = useState('todos')

  const categories = useMemo(() => [...new Set(productos.map(p => p.categoria))], [productos])

  const filtered = category === 'todos'
    ? productos
    : productos.filter(p => p.categoria === category)

  return (
    <section className="section active">
      <div className="container">
        <h1 className="section-title">Nuestros Productos</h1>
        <div className="category-filters">
          <button
            className={`filter-btn ${category === 'todos' ? 'active' : ''}`}
            onClick={() => setCategory('todos')}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {capitalize(cat)}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.imagen} alt={p.nombre} />
              </div>
              <span className="product-category">{capitalize(p.categoria)}</span>
              <h3>{p.nombre}</h3>
              <p className="product-producer">{p.productor}</p>
              <p className="product-price">{Number(p.precio).toFixed(2)} €</p>
              <button
                className="btn btn-primary btn-add-cart"
                onClick={() => { addToCarrito(p); showToast(`✅ ${p.nombre} añadido al carrito`) }}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
