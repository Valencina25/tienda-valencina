import { useStore } from '../context/StoreContext'

export default function Home() {
  const { productos, addToCarrito, showToast } = useStore()
  const destacados = productos.slice(0, 4)

  return (
    <section className="section active">
      <div className="hero">
        <div className="container">
          <h1>Productos Artesanales de Valencina</h1>
          <p>Apoyando productores locales desde 2008</p>
        </div>
      </div>
      <div className="container">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {destacados.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.imagen} alt={p.nombre} />
              </div>
              <span className="product-category">{capitalize(p.categoria)}</span>
              <h3>{p.nombre}</h3>
              <p className="product-price">{Number(p.precio).toFixed(2)} €</p>
              <button className="btn btn-primary" onClick={() => { addToCarrito(p); showToast(`✅ ${p.nombre} añadido al carrito`) }}>
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
