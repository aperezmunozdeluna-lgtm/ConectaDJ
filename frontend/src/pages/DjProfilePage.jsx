import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  crearOpinion,
  guardarDjFavorito,
  listarOpinionesDj,
  obtenerDjPorId,
  obtenerMensajeError,
} from '../services/api'
import { getSession } from '../services/session'

function DjProfilePage() {
  const { id } = useParams()
  const [dj, setDj] = useState(null)
  const [opiniones, setOpiniones] = useState([])
  const [opinionForm, setOpinionForm] = useState({
    rating: '5',
    comment: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [opinionMessage, setOpinionMessage] = useState('')
  const [favoriteMessage, setFavoriteMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [id])

  function loadProfile() {
    setLoading(true)

    Promise.all([obtenerDjPorId(id), listarOpinionesDj(id)])
      .then(([djData, opinionesData]) => {
        setDj(djData)
        setOpiniones(opinionesData)
        setError('')
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleOpinionChange(event) {
    const { name, value } = event.target
    setOpinionForm({
      ...opinionForm,
      [name]: value,
    })
  }

  function handleOpinionSubmit(event) {
    event.preventDefault()

    const session = getSession()
    if (!session?.organizerProfileId) {
      setOpinionMessage('Solo particulares y fiestas privadas pueden valorar a un DJ.')
      return
    }

    setOpinionMessage('Guardando opinion...')

    crearOpinion({
      djProfileId: Number(id),
      organizerId: session.organizerProfileId,
      rating: Number(opinionForm.rating),
      comment: opinionForm.comment,
    })
      .then(() => {
        setOpinionForm({
          rating: '5',
          comment: '',
        })
        setOpinionMessage('Opinion guardada correctamente.')
        loadProfile()
      })
      .catch((opinionError) => {
        setOpinionMessage(obtenerMensajeError(opinionError))
      })
  }

  function handleSaveFavorite() {
    const session = getSession()
    if (!session?.organizerProfileId) {
      setFavoriteMessage('Inicia sesion como particular o fiesta privada para guardar este DJ.')
      return
    }

    setFavoriteMessage('Guardando DJ...')

    guardarDjFavorito(session.organizerProfileId, Number(id))
      .then(() => {
        setFavoriteMessage('DJ guardado en tu panel.')
      })
      .catch((favoriteError) => {
        setFavoriteMessage(obtenerMensajeError(favoriteError))
      })
  }

  if (loading) {
    return (
      <main className="section">
        <p className="muted">Cargando perfil...</p>
      </main>
    )
  }

  if (error || !dj) {
    return (
      <main className="section">
        <h1>Perfil no encontrado</h1>
        <p className="muted">{error}</p>
        <Link className="button primary" to="/buscar-djs">
          Volver al buscador
        </Link>
      </main>
    )
  }

  const styles = dj.styles || []
  const rating = dj.rating ?? dj.avgRating ?? 0
  const session = getSession()
  const messageLink = session ? `/mensajes?userId=${dj.userId}` : '/login'
  const puedeOpinar = session?.role === 'organizer' || session?.role === 'private_party'
  const puedeGuardarFavorito = puedeOpinar

  return (
    <main className="section">
      <section className="profile-header">
        {dj.profilePhoto ? (
          <img className="profile-photo" src={dj.profilePhoto} alt={dj.artistName} />
        ) : (
          <div className="avatar large">{dj.artistName.charAt(0)}</div>
        )}
        <div>
          <p className="eyebrow">Perfil DJ</p>
          <h1>{dj.artistName}</h1>
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
            <Link className="button primary" to={messageLink}>
              Enviar mensaje
            </Link>
            {puedeGuardarFavorito && (
              <button className="button secondary" type="button" onClick={handleSaveFavorite}>
                Guardar DJ
              </button>
            )}
            <Link className="button secondary" to="/buscar-djs">
              Volver
            </Link>
          </div>
          {favoriteMessage && <p className="muted">{favoriteMessage}</p>}
        </div>
      </section>

      <section className="content-block">
        <h2>Descripcion</h2>
        <p>{dj.bio || 'Este DJ todavia no ha anadido una descripcion.'}</p>
      </section>

      <section className="opiniones-layout">
        <div className="content-block">
          <div className="section-title">
            <div>
              <p className="eyebrow">Opiniones</p>
              <h2>Valoraciones de clientes</h2>
            </div>
            <span className="status active">{rating}/5</span>
          </div>

          <div className="opinion-list">
            {opiniones.length === 0 ? (
              <p className="muted">Este DJ todavia no tiene opiniones.</p>
            ) : (
              opiniones.map((opinion) => (
                <article className="opinion-card" key={opinion.id}>
                  <div className="opinion-header">
                    <strong>{opinion.organizerName || 'Particular o fiesta privada'}</strong>
                    <span>{opinion.rating}/5</span>
                  </div>
                  <p>{opinion.comment || 'Sin comentario.'}</p>
                  <small>{opinion.createdAt?.substring(0, 10)}</small>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="content-block">
          <p className="eyebrow">Tu opinion</p>
          <h2>Valorar DJ</h2>
          {puedeOpinar ? (
            <form className="form" onSubmit={handleOpinionSubmit}>
              <label>
                Puntuacion
                <select name="rating" value={opinionForm.rating} onChange={handleOpinionChange}>
                  <option value="5">5 - Excelente</option>
                  <option value="4">4 - Muy bien</option>
                  <option value="3">3 - Correcto</option>
                  <option value="2">2 - Mejorable</option>
                  <option value="1">1 - Mal</option>
                </select>
              </label>
              <label>
                Comentario
                <textarea
                  name="comment"
                  rows="5"
                  placeholder="Cuenta brevemente como fue la experiencia"
                  value={opinionForm.comment}
                  onChange={handleOpinionChange}
                />
              </label>
              <button className="button primary" type="submit">
                Guardar opinion
              </button>
              {opinionMessage && <p className="muted">{opinionMessage}</p>}
            </form>
          ) : (
            <p className="muted">
              Inicia sesion como particular o fiesta privada para valorar a este DJ.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default DjProfilePage
