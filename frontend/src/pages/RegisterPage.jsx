import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerMensajeError, registrarUsuario } from '../services/api'
import { saveSession } from '../services/session'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    role: 'dj',
    name: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('Creando cuenta...')

    registrarUsuario(formData)
      .then((session) => {
        saveSession(session)
        navigate(getPanelPath(session.role))
      })
      .catch((error) => {
        setMessage(obtenerMensajeError(error))
      })
  }

  function getPanelPath(role) {
    if (role === 'organizer') {
      return '/panel-organizador'
    }

    if (role === 'private_party') {
      return '/panel-fiesta-privada'
    }

    return '/panel-dj'
  }

  function getNameLabel() {
    if (formData.role === 'organizer') {
      return 'Nombre del particular o local'
    }

    if (formData.role === 'private_party') {
      return 'Nombre de la sala, empresa o fiesta'
    }

    return 'Nombre artistico'
  }

  function getNamePlaceholder() {
    if (formData.role === 'organizer') {
      return 'Ej: Sala Central'
    }

    if (formData.role === 'private_party') {
      return 'Ej: Eventos BlackRoom'
    }

    return 'Ej: Alex Beat'
  }

  return (
    <main className="form-page">
      <section className="form-box">
        <p className="eyebrow">Crear cuenta</p>
        <h1>Registro de usuario</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Tipo de cuenta
            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="dj">DJ</option>
              <option value="organizer">Particular / sala</option>
              <option value="private_party">Fiesta privada / empresa de eventos</option>
            </select>
          </label>
          <label>
            {getNameLabel()}
            <input
              name="name"
              type="text"
              placeholder={getNamePlaceholder()}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Correo electronico
            <input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Contrasena
            <input
              name="password"
              type="password"
              placeholder="Minimo 4 caracteres"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="4"
            />
          </label>
          <button className="button primary" type="submit">
            Crear cuenta
          </button>
          {message && <p className="muted">{message}</p>}
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
