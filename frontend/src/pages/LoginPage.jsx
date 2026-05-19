import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesion, obtenerMensajeError } from '../services/api'
import { saveSession } from '../services/session'

const usuariosPrueba = {
  dj: {
    email: 'alex@example.com',
    password: 'demo123',
  },
  organizer: {
    email: 'organizador@example.com',
    password: 'demo123',
  },
  fiestaPrivada: {
    email: 'fiestaprivada@example.com',
    password: 'demo123',
  },
}

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
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
    login(formData)
  }

  function login(credentials) {
    setMessage('Iniciando sesion...')

    iniciarSesion(credentials)
      .then((session) => {
        saveSession(session)
        navigate(getPanelPath(session.role))
      })
      .catch((error) => {
        setMessage(obtenerMensajeError(error))
      })
  }

  function handleLoginPrueba(type) {
    setFormData(usuariosPrueba[type])
    login(usuariosPrueba[type])
  }

  function getPanelPath(role) {
    if (role === 'organizer') {
      return '/panel-organizador'
    }

    if (role === 'private_party') {
      return '/panel-fiesta-privada'
    }

    if (role === 'admin') {
      return '/panel-admin'
    }

    return '/panel-dj'
  }

  return (
    <main className="form-page">
      <section className="form-box">
        <p className="eyebrow">Acceso</p>
        <h1>Iniciar sesion</h1>
        <div className="acceso-prueba">
          <button className="button secondary" type="button" onClick={() => handleLoginPrueba('dj')}>
            Entrar como DJ de prueba
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => handleLoginPrueba('organizer')}
          >
            Entrar como particular
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => handleLoginPrueba('fiestaPrivada')}
          >
            Entrar como fiesta privada
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
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
              placeholder="Tu contrasena"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <button className="button primary" type="submit">
            Entrar
          </button>
          {message && <p className="muted">{message}</p>}
        </form>
      </section>
    </main>
  )
}

export default LoginPage
