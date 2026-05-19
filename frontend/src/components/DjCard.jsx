import { Link } from 'react-router-dom'
import { useState } from 'react'
import { guardarDjFavorito, obtenerMensajeError } from '../services/api'
import { getSession } from '../services/session'

function DjCard({ dj }) {
  const styles = dj.styles || []
  const rating = dj.rating ?? dj.avgRating ?? 0
  const session = getSession()
  const [message, setMessage] = useState('')

  function canSaveDj() {
    return session?.role === 'organizer' || session?.role === 'private_party'
  }

  function handleSaveFavorite() {
    if (!canSaveDj() || !session?.organizerProfileId) {
      setMessage('Inicia sesion como particular o fiesta privada para guardar DJs')
      return
    }

    setMessage('Guardando...')

    guardarDjFavorito(session.organizerProfileId, dj.id)
      .then(() => {
        setMessage('DJ guardado en tu panel')
      })
      .catch((error) => {
        setMessage(obtenerMensajeError(error))
      })
  }

  return (
    <article className="dj-card">
      <Link className="card-media-link" to={`/djs/${dj.id}`} aria-label={`Ver perfil de ${dj.artistName}`}>
        {dj.profilePhoto ? (
          <img className="card-photo" src={dj.profilePhoto} alt={dj.artistName} />
        ) : (
          <div className="avatar">{dj.artistName.charAt(0)}</div>
        )}
      </Link>
      <div className="dj-card-content">
        <div className="card-header">
          <h3>
            <Link className="text-link" to={`/djs/${dj.id}`}>
              {dj.artistName}
            </Link>
          </h3>
          <span className={dj.available ? 'status active' : 'status'}>
            {dj.available ? 'Disponible' : 'No disponible'}
          </span>
        </div>
        <p className="muted">
          {dj.city} - {dj.experienceYears} anios de experiencia - {rating}/5
        </p>
        <div className="chips">
          {styles.length > 0 ? (
            styles.map((style) => (
              <span className="chip" key={style}>
                {style}
              </span>
            ))
          ) : (
            <span className="chip">Sin estilos asignados</span>
          )}
        </div>
        <div className="card-actions">
          <Link className="button secondary" to={`/djs/${dj.id}`}>
            Ver perfil y opiniones
          </Link>
          {canSaveDj() && (
            <button className="button secondary" type="button" onClick={handleSaveFavorite}>
              Guardar DJ
            </button>
          )}
          <Link className="button primary" to={`/mensajes?userId=${dj.userId}`}>
            Enviar mensaje
          </Link>
        </div>
        {message && <p className="muted card-message">{message}</p>}
      </div>
    </article>
  )
}

export default DjCard
