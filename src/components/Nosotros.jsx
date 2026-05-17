import { useStore } from '../context/StoreContext'

export default function Nosotros() {
  const { productos } = useStore()

  return (
    <section className="section active">
      <div className="container">
        <h1 className="section-title">Nuestra Historia</h1>
        <div className="about-card">
          <div className="about-text">
            <h2>Desde 2008 en Valencina</h2>
            <p>Más de 15 años apoyando productores locales y ofreciendo productos artesanales de calidad.</p>
            <p>Nuestra misión es acercarte lo mejor de la tradición y el sabor auténtico de Andalucía.</p>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Años</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Productores</span>
              </div>
              <div className="stat">
                <span className="stat-number">{productos.length}</span>
                <span className="stat-label">Productos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
