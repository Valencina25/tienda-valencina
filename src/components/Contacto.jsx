import { useStore } from '../context/StoreContext'

const API = '/api'

export default function Contacto() {
  const { showToast } = useStore()

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = {
      nombre: form.name.value,
      email: form.email.value,
      mensaje: form.message.value
    }
    try {
      const res = await fetch(`${API}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        showToast('✅ Mensaje enviado correctamente')
        form.reset()
      } else {
        showToast('❌ Error al enviar mensaje')
      }
    } catch {
      showToast('❌ Error de conexión')
    }
  }

  return (
    <section className="section active">
      <div className="container">
        <h1 className="section-title">Contacto</h1>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>📍 Visítanos🍅</h3>
            <p><strong>Calle Itálica 6</strong><br />41907 Valencina de la Concepción, Sevilla</p>
            <p>📞 <a href="tel:+34652864329">+34 652 864 329</a></p>
            <p>✉️ <a href="mailto:valencina2012@hotmail.es">valencina2012@hotmail.es</a></p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>📨 Envíanos un mensaje</h3>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea name="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </section>
  )
}
