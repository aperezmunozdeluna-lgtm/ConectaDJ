import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  inscribirseOferta,
  listarCandidaturasDj,
  listarEstilosMusicales,
  listarUsuarios,
  obtenerOfertaPorId,
  obtenerMensajeError,
} from '../services/api'
import { getSession } from '../services/session'
import heroImage from '../assets/hero.png'

function isOrganizerRole(role) {
  return role === 'organizer' || role === 'private_party'
}

function OfferDetailPage() {
  const { id } = useParams()
  const [offer, setOffer] = useState(null)
  const [organizer, setOrganizer] = useState(null)
  const [musicStyles, setMusicStyles] = useState([])
  const [application, setApplication] = useState(null)
  const [session, setSession] = useState(getSession())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [applicationText, setApplicationText] = useState('')

  useEffect(() => {
    const currentSession = getSession()
    const applicationsRequest =
      currentSession?.role === 'dj' && currentSession.djProfileId
        ? listarCandidaturasDj(currentSession.djProfileId)
        : Promise.resolve([])

    setSession(currentSession)

    Promise.all([
      obtenerOfertaPorId(id),
      listarUsuarios(),
      listarEstilosMusicales(),
      applicationsRequest,
    ])
      .then(([offerData, usersData, stylesData, applicationsData]) => {
        setOffer(offerData)
        setMusicStyles(stylesData)
        setApplication(
          applicationsData.find((item) => item.jobOfferId === Number(id)) || null,
        )
        setOrganizer(
          usersData.find(
            (user) => isOrganizerRole(user.role) && user.profileId === offerData.organizerId,
          ) || null,
        )
        setError('')
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  function formatBudget(value) {
    if (!value) {
      return 'No indicado'
    }

    return `${Number(value).toFixed(0)} euros`
  }

  function getOrganizerLabel(role) {
    return role === 'private_party' ? 'Fiesta privada' : 'Particular, empresa o sala'
  }

  function getStyleName(musicStyleId) {
    const style = musicStyles.find((item) => item.id === musicStyleId)
    return style?.name || 'Sin indicar'
  }

  function getApplicationLabel(status) {
    const labels = {
      pending: 'Candidatura pendiente',
      accepted: 'Candidatura aceptada',
      rejected: 'Candidatura rechazada',
      withdrawn: 'Candidatura retirada',
    }

    return labels[status] || status
  }

  function getOfferStatusLabel(status) {
    const labels = {
      open: 'Abierta',
      closed: 'Cerrada',
      cancelled: 'Cancelada',
    }

    return labels[status] || status
  }

  function handleApply() {
    if (!session || session.role !== 'dj' || !session.djProfileId) {
      setMessage('Inicia sesion como DJ para inscribirte')
      return
    }

    if (offer.status !== 'open') {
      setMessage('Esta oferta no esta abierta ahora mismo')
      return
    }

    const mensajeCandidatura = applicationText.trim()

    if (mensajeCandidatura.length < 10) {
      setMessage('Escribe un mensaje de al menos 10 caracteres para explicar tu candidatura.')
      return
    }

    setMessage('Enviando candidatura...')

    inscribirseOferta(
      offer.id,
      session.djProfileId,
      mensajeCandidatura,
    )
      .then((savedApplication) => {
        setApplication(savedApplication)
        setMessage('Candidatura enviada correctamente')
      })
      .catch((requestError) => {
        setMessage(obtenerMensajeError(requestError))
      })
  }

  if (loading) {
    return (
      <main className="section">
        <p className="muted">Cargando oferta...</p>
      </main>
    )
  }

  if (error || !offer) {
    return (
      <main className="section">
        <h1>Oferta no encontrada</h1>
        <p className="muted">{error}</p>
        <Link className="button primary" to="/ofertas">
          Volver a ofertas
        </Link>
      </main>
    )
  }

  const contactLink = organizer ? `/mensajes?userId=${organizer.userId}` : '/mensajes'
  const canApply =
    session?.role === 'dj' &&
    offer.status === 'open' &&
    (!application || application.status === 'withdrawn')

  return (
    <main>
      <section
        className="offer-detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.38)), url(${offer.imageUrl || heroImage})`,
        }}
      >
        <div className="offer-detail-copy">
          <p className="eyebrow">Oferta publicada</p>
          <h1>{offer.title}</h1>
          <p>
            {offer.city} - {offer.eventDate || 'Fecha sin definir'} -{' '}
            {getOfferStatusLabel(offer.status)}
          </p>
          {application && (
            <div className="application-state hero-application-state">
              <strong>{getApplicationLabel(application.status)}</strong>
              <span>
                {application.status === 'withdrawn'
                  ? 'La retiraste, pero puedes volver a inscribirte si sigue abierta.'
                  : 'Puedes seguir esta candidatura desde tu panel de DJ.'}
              </span>
            </div>
          )}
          {session?.role === 'dj' && offer.status === 'open' && (
            <label className="application-note hero-application-note">
              Mensaje para quien publica
              <textarea
                rows="3"
                placeholder="Hola, me interesa esta oferta. Puedo adaptarme al estilo del evento."
                value={applicationText}
                onChange={(event) => setApplicationText(event.target.value)}
              />
            </label>
          )}
          <div className="hero-actions">
            <button
              className="button primary"
              type="button"
              disabled={session?.role === 'dj' && !canApply}
              onClick={handleApply}
            >
              {application?.status === 'withdrawn' ? 'Volver a inscribirme' : 'Inscribirme'}
            </button>
            <Link className="button secondary" to={session ? contactLink : '/login'}>
              Enviar mensaje
            </Link>
          </div>
          {message && <p className="detail-message">{message}</p>}
        </div>
      </section>

      <section className="section offer-detail-layout">
        <article className="content-block">
          <h2>Descripcion del evento</h2>
          <p>{offer.description}</p>
        </article>

        <aside className="detail-side">
          <article className="detail-summary">
            <h2>Datos clave</h2>
            <div className="detail-data">
              <span>Ciudad</span>
              <strong>{offer.city}</strong>
            </div>
            <div className="detail-data">
              <span>Presupuesto</span>
              <strong>{formatBudget(offer.budget)}</strong>
            </div>
            <div className="detail-data">
              <span>Duracion</span>
              <strong>{offer.durationHours || 'Sin indicar'} h</strong>
            </div>
            <div className="detail-data">
              <span>Estilo musical</span>
              <strong>{getStyleName(offer.musicStyleId)}</strong>
            </div>
            <div className="detail-data">
              <span>Experiencia minima</span>
              <strong>{offer.minExperienceYears || 0} anios</strong>
            </div>
          </article>

          <article className="organizer-box">
            {organizer?.photoUrl ? (
              <img src={organizer.photoUrl} alt={organizer.displayName} />
            ) : (
              <div className="image-placeholder">Perfil</div>
            )}
            <h2>{organizer?.displayName || 'Perfil que publica'}</h2>
            <p className="muted">
              {organizer ? getOrganizerLabel(organizer.role) : 'Perfil que publica la oferta.'}
            </p>
            <Link className="button secondary" to={session ? contactLink : '/login'}>
              Contactar
            </Link>
          </article>
        </aside>
      </section>
    </main>
  )
}

export default OfferDetailPage
