import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API = '/api'
const ADMIN_PASSWORD = 'juan1962'

const StoreContext = createContext()

function loadCarrito() {
  return JSON.parse(localStorage.getItem('tienda_carrito') || '[]')
}

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState(loadCarrito)
  const [pedidos, setPedidos] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/productos`)
      .then(r => r.json())
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('tienda_carrito', JSON.stringify(carrito))
  }, [carrito])

  const addProducto = useCallback(async (producto) => {
    const data = { ...producto, precio: parseFloat(producto.precio) }
    if (data.imagen && !data.imagen.startsWith('http') && !data.imagen.startsWith('data:') && !data.imagen.startsWith('imagenes/')) {
      data.imagen = 'imagenes/' + data.imagen
    }
    const res = await fetch(`${API}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      const nuevo = await res.json()
      setProductos(prev => [...prev, nuevo])
      return nuevo
    }
  }, [])

  const updateProducto = useCallback(async (id, data) => {
    if (data.imagen && !data.imagen.startsWith('http') && !data.imagen.startsWith('data:') && !data.imagen.startsWith('imagenes/')) {
      data.imagen = 'imagenes/' + data.imagen
    }
    const res = await fetch(`${API}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      const updated = await res.json()
      setProductos(prev => prev.map(p => p.id === id ? updated : p))
    }
  }, [])

  const removeProducto = useCallback(async (id) => {
    await fetch(`${API}/productos/${id}`, { method: 'DELETE' })
    setProductos(prev => prev.filter(p => p.id !== id))
  }, [])

  const resetProductos = useCallback(async () => {
    const res = await fetch(`${API}/productos/reset`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setProductos(data)
    }
  }, [])

  const addToCarrito = useCallback((producto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.id === producto.id)
      if (existing) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }, [])

  const removeFromCarrito = useCallback((id) => {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateCantidadCarrito = useCallback((id, cantidad) => {
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item))
  }, [])

  const clearCarrito = useCallback(() => {
    setCarrito([])
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const confirmarPedido = useCallback(async (clienteData) => {
    const total = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0)
    const res = await fetch(`${API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente: clienteData, items: carrito, total })
    })
    if (res.ok) {
      const pedido = await res.json()
      setPedidos(prev => [pedido, ...prev])
      clearCarrito()
      return pedido
    }
  }, [carrito, clearCarrito])

  const loadPedidos = useCallback(async () => {
    const res = await fetch(`${API}/pedidos`)
    if (res.ok) setPedidos(await res.json())
  }, [])

  const removePedido = useCallback(async (id) => {
    await fetch(`${API}/pedidos/${id}`, { method: 'DELETE' })
    setPedidos(prev => prev.filter(p => p.id !== id))
  }, [])

  const cartCount = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <StoreContext.Provider value={{
      productos, carrito, pedidos, toast, ADMIN_PASSWORD, cartCount, loading,
      addProducto, updateProducto, removeProducto, resetProductos,
      addToCarrito, removeFromCarrito, updateCantidadCarrito, clearCarrito,
      showToast, confirmarPedido, removePedido, loadPedidos, setCarrito
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
