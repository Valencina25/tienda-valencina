import { useStore } from '../context/StoreContext'
import CheckoutModal from './CheckoutModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Carrito() {
  const { carrito, removeFromCarrito, updateCantidadCarrito, clearCarrito, showToast } = useStore()
  const [showCheckout, setShowCheckout] = useState(false)
  const navigate = useNavigate()

  const subtotal = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0)

  if (carrito.length === 0) {
    return (
      <section className="section active">
        <div className="container">
          <h1 className="section-title">Tu Carrito</h1>
          <div className="cart-container">
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <button className="btn btn-primary" onClick={() => navigate('/productos')}>
                Ver Productos
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="section active">
        <div className="container">
          <h1 className="section-title">Tu Carrito</h1>
          <div className="cart-container">
            <div className="cart-items">
              {carrito.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-img">
                    <img src={item.imagen} alt={item.nombre} />
                  </div>
                  <div className="cart-details">
                    <h4>{item.nombre}</h4>
                    <p>{Number(item.precio).toFixed(2)} €</p>
                    <div className="cart-actions">
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        className="cart-qty"
                        onChange={(e) => updateCantidadCarrito(item.id, parseInt(e.target.value))}
                      />
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => { removeFromCarrito(item.id); showToast('Producto eliminado del carrito') }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => setShowCheckout(true)}>
                Finalizar Compra
              </button>
              <button
                className="btn btn-danger"
                onClick={() => { clearCarrito(); showToast('Carrito vaciado') }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </section>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  )
}
