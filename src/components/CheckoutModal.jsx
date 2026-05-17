import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function CheckoutModal({ onClose }) {
  const { carrito, confirmarPedido, showToast } = useStore()
  const [confirmPedido, setConfirmPedido] = useState(null)

  const total = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0)
  const pedidoNumero = Date.now().toString().slice(-6)

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const clienteData = {
      nombre: formData.get('nombre'),
      telefono: formData.get('telefono'),
      email: formData.get('email'),
      direccion: formData.get('direccion'),
      ciudad: formData.get('ciudad'),
      notas: formData.get('notas')
    }
    const pedido = confirmarPedido(clienteData)
    setConfirmPedido(pedido)
    showToast('✅ Pedido confirmado')
    e.target.reset()
  }

  if (confirmPedido) {
    return (
      <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content confirm-content">
          <div className="confirm-header">
            <div className="confirm-icon">✓</div>
            <h2>¡Pedido Confirmado!</h2>
            <p className="confirm-subtitle">Gracias por tu compra</p>
          </div>
          <div className="confirm-body">
            <div className="confirm-section">
              <h4>Datos del Cliente</h4>
              <div className="confirm-cliente-item"><strong>Nombre:</strong> <span>{confirmPedido.cliente.nombre}</span></div>
              <div className="confirm-cliente-item"><strong>Teléfono:</strong> <span>{confirmPedido.cliente.telefono}</span></div>
              <div className="confirm-cliente-item"><strong>Email:</strong> <span>{confirmPedido.cliente.email}</span></div>
              <div className="confirm-cliente-item"><strong>Dirección:</strong> <span>{confirmPedido.cliente.direccion}, {confirmPedido.cliente.ciudad}</span></div>
              {confirmPedido.cliente.notas && <div className="confirm-cliente-item"><strong>Notas:</strong> <span>{confirmPedido.cliente.notas}</span></div>}
            </div>
            <div className="confirm-section">
              <h4>Pedido #{confirmPedido.id.toString().slice(-6)}</h4>
              {confirmPedido.items.map(item => (
                <div className="confirm-item" key={item.id}>
                  <span className="confirm-item-name">{item.nombre} x{item.cantidad}</span>
                  <span className="confirm-item-price">{(Number(item.precio) * item.cantidad).toFixed(2)} €</span>
                </div>
              ))}
              <div className="confirm-total">
                <span>Total pagado:</span>
                <span>{confirmPedido.total.toFixed(2)} €</span>
              </div>
            </div>
            <div className="confirm-note">
              <p>📧 Recibirás un email de confirmación en breve</p>
              <p>📦 Tiempo estimado de entrega: 24-48h</p>
            </div>
          </div>
          <div className="confirm-actions">
            <button className="btn btn-primary" onClick={onClose}>Volver al Inicio</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>Finalizar Compra</h2>
            <span className="modal-subtitle">Pedido #{pedidoNumero}</span>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-text">Datos</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-text">Entrega</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-text">Pago</span>
            </div>
          </div>

          <div className="form-section">
            <h3>Datos del Cliente</h3>
            <div className="form-group">
              <label>Nombre completo *</label>
              <input type="text" name="nombre" required placeholder="Tu nombre completo" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Teléfono *</label>
                <input type="tel" name="telefono" required placeholder="+34 600 000 000" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" required placeholder="tu@email.com" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Dirección de Entrega</h3>
            <div className="form-group">
              <label>Dirección completa *</label>
              <input type="text" name="direccion" required placeholder="Calle, número, piso..." />
            </div>
            <div className="form-group">
              <label>Ciudad *</label>
              <input type="text" name="ciudad" required placeholder="Valencina de la Concepción" />
            </div>
          </div>

          <div className="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea name="notas" rows="2" placeholder="Instrucciones especiales para la entrega..."></textarea>
          </div>

          <div className="checkout-summary">
            <h4>Resumen del pedido</h4>
            <div className="checkout-items-list">
              {carrito.map(item => (
                <div className="checkout-item-pro" key={item.id}>
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.nombre}</span>
                    <span className="checkout-item-qty">Cantidad: {item.cantidad}</span>
                  </div>
                  <span className="checkout-item-price">{(Number(item.precio) * item.cantidad).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Total a pagar:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="secure-badge">
            <span>🔒</span> Compra segura - Tus datos están protegidos
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary btn-submit">Confirmar Pedido</button>
          </div>
        </form>
      </div>
    </div>
  )
}
