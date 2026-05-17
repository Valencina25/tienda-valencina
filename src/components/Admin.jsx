import { useState, useEffect, useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const { ADMIN_PASSWORD } = useStore()
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (checked) return
    setChecked(true)
    const pwd = prompt('Introduce contraseña de admin:')
    if (pwd !== ADMIN_PASSWORD) {
      alert('Contraseña incorrecta')
      navigate('/')
    } else {
      setOk(true)
    }
  }, [ADMIN_PASSWORD, navigate, checked])

  if (!ok) return null

  return <AdminPanel />
}

function AdminPanel() {
  const { productos, addProducto, updateProducto, removeProducto, resetProductos, pedidos, loadPedidos, removePedido, showToast } = useStore()
  const [tab, setTab] = useState('productos')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: '', productor: '', imagen: '' })

  useEffect(() => { loadPedidos() }, [loadPedidos])

  const totalVentas = useMemo(() => pedidos.reduce((acc, p) => acc + p.total, 0), [pedidos])

  function handleEdit(p) {
    setEditId(p.id)
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      categoria: p.categoria,
      productor: p.productor,
      imagen: p.imagen.replace('imagenes/', '')
    })
  }

  function handleCancelEdit() {
    setEditId(null)
    setForm({ nombre: '', precio: '', categoria: '', productor: '', imagen: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editId) {
      updateProducto(editId, { ...form, precio: parseFloat(form.precio) })
      showToast('Producto actualizado')
    } else {
      addProducto({ ...form, precio: parseFloat(form.precio) })
      showToast('Producto añadido')
    }
    handleCancelEdit()
  }

  return (
    <section className="section active">
      <div className="container">
        <h1 className="section-title">Panel de Administración</h1>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'productos' ? 'active' : ''}`} onClick={() => setTab('productos')}>📦 Productos</button>
          <button className={`admin-tab ${tab === 'pedidos' ? 'active' : ''}`} onClick={() => setTab('pedidos')}>🛒 Pedidos</button>
          <button className={`admin-tab ${tab === 'estadisticas' ? 'active' : ''}`} onClick={() => setTab('estadisticas')}>📊 Estadísticas</button>
        </div>

        {tab === 'productos' && (
          <div className="admin-tab-content active">
            <div className="admin-card">
              <h2>{editId ? 'Editar' : 'Añadir'} Producto</h2>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <input type="text" placeholder="Nombre del producto" required
                    value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                  <input type="number" placeholder="Precio (€)" step="0.01" required
                    value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Categoría" required
                    value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
                  <input type="text" placeholder="Productor" required
                    value={form.productor} onChange={(e) => setForm({ ...form, productor: e.target.value })} />
                </div>
                <input type="text" placeholder="Nombre de imagen (ej: miel.jpg)" required
                  value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">{editId ? 'Actualizar' : 'Guardar'} Producto</button>
                  {editId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h2>Lista de Productos</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>{Number(p.precio).toFixed(2)} €</td>
                        <td>
                          <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p)}>Editar</button>
                          {' '}
                          <button className="btn btn-danger btn-sm" onClick={() => { removeProducto(p.id); showToast('Producto eliminado') }}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-danger" style={{ marginTop: '1rem' }} onClick={() => { if (confirm('¿Resetear todos los productos?')) { resetProductos(); showToast('Productos reseteados') } }}>
                Resetear Productos
              </button>
            </div>
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="admin-tab-content active">
            <div className="admin-card">
              <h2>Historial de Pedidos</h2>
              {pedidos.length === 0 ? (
                <div className="empty-state"><p>No hay pedidos realizados</p></div>
              ) : (
                pedidos.map(p => (
                  <div className="pedido-card" key={p.id}>
                    <div className="pedido-header">
                      <span className="pedido-id">Pedido #{p.id.toString().slice(-6)}</span>
                      <span className="pedido-fecha">{p.fecha}</span>
                    </div>
                    {p.cliente && (
                      <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                        <strong>{p.cliente.nombre}</strong><br />
                        📞 {p.cliente.telefono} | ✉️ {p.cliente.email}<br />
                        📍 {p.cliente.direccion}, {p.cliente.ciudad}
                        {p.cliente.notas && <><br /><em>Nota: {p.cliente.notas}</em></>}
                      </div>
                    )}
                    <div className="pedido-items">
                      {p.items.map((item, i) => (
                        <div className="pedido-item" key={i}>
                          <span>{item.nombre} x{item.cantidad}</span>
                          <span>{(Number(item.precio) * item.cantidad).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                    <div className="pedido-header" style={{ marginTop: '0.5rem' }}>
                      <span>Total</span>
                      <span className="pedido-total">{p.total.toFixed(2)} €</span>
                      <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}
                        onClick={() => { if (confirm('¿Eliminar este pedido?')) { removePedido(p.id); showToast('Pedido eliminado') } }}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'estadisticas' && (
          <div className="admin-tab-content active">
            <div className="admin-card">
              <h2>Resumen</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{productos.length}</span>
                  <span className="stat-label">Productos</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{pedidos.length}</span>
                  <span className="stat-label">Pedidos</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{totalVentas.toFixed(2)} €</span>
                  <span className="stat-label">Ventas Totales</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
