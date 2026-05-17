import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Header() {
  const { pathname } = useLocation()
  const { cartCount } = useStore()

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/admin', label: 'Admin' },
  ]

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🌿</span> TiendaLocal
        </Link>
        <nav className="nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/carrito"
            className={`nav-link cart-link ${pathname === '/carrito' ? 'active' : ''}`}
          >
            🛒 <span className="cart-count">{cartCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
