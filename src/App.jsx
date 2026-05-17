import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Productos from './components/Productos'
import Nosotros from './components/Nosotros'
import Contacto from './components/Contacto'
import Admin from './components/Admin'
import Carrito from './components/Carrito'
import Toast from './components/Toast'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 TiendaLocal | Valencina de la Concepción, Sevilla</p>
        </div>
      </footer>
      <Toast />
    </>
  )
}
