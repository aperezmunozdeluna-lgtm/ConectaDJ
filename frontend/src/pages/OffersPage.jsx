import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  inscribirseOferta,
  listarCandidaturasDj,
  listarEstilosMusicales,
  listarOfertas,
  listarUsuarios,
  obtenerMensajeError,
} from '../services/api'
import { getSession } from '../services/session'
import heroImage from '../assets/hero.png'

const emptyFilters = {
  city: '',
  musicStyleId: '0',
  minBudget: '',
  maxExperience: '0',
}

function OffersPage() {
  const [offers, setOffers] = useState([])
  const [users, setUsers] = useState([])
  const [musicStyles, setMusicStyles] = useState([])
  const [djApplications, setDjApplications] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [session, setSession] = useState(getSession())
  const [applicationForms, setApplicationForms] = useState({})
  const [applicationMessages, setApplicationMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const currentSession = getSession()
    const applicationsRequest =
      currentSession?.role === 'dj' && currentSession.djProfileId
        ? listarCandidaturasDj(currentSession.djProfileId)
        : Promise.resolve([])

    setSession(currentSession)
    setLoading(true)

    Promise.all([
      listarOfertas(filters),
      listarUsuarios(),
      listarEstilosMusicales(),
      applicationsRequest,
    ])
      .then(([offersData, usersData, stylesData, applicationsData]) => {
        setOffers(offersData)
        setUsers(usersData)
        setMusicStyles(stylesData)
        setDjApplications(applicationsData)
        setError('')
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [filters])

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  function clearFilters() {
    setFilters(emptyFilters)
  }

  function getOrganizerUser(offer) {
    return users.find(
      (user) => isOrganizerRole(user.role) && user.profileId === offer.organizerId,
    )
  }

  function isOrganizerRole(role) {
    return role === 'organizer' || role === 'private_party'
  }

  function getOrganizerLabel(role) {
    return role === 'private_party' ? 'Fiesta privada' : 'Particular o sala'
  }

  function getStyleName(musicStyleId) {
    const style = musicStyles.find((item) => item.id === musicStyleId)
    return style?.name || 'Estilo sin indicar'
  }

  function getApplicationForOffer(offerId) {
    return djApplications.find((application) => application.jobOfferId === offerId)
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

  function formatBudget(value) {
    if (!value) {
      return 'No indicado'
    }

    return `${Number(value).toFixed(0)} euros`
  }

  function handleApplicationMessageChange(offerId, value) {
    setApplicationForms({
      ...applicationForms,
      [offerId]: value,
    })
  }

  function handleApply(offerId) {
    if (!session || session.role !== 'dj' || !session.djProfileId) {
      setApplicationMessages((currentMessages) => ({
        ...currentMessages,
        [offerId]: 'Inicia sesion como DJ para inscribirte',
      }))
      return
    }

    const selectedOffer = offers.find((offer) => offer.id === offerId)

    if (selectedOffer?.status !== 'open') {
      setApplicationMessages((currentMessages) => ({
        ...currentMessages,
        [offerId]: 'Esta oferta no esta abierta ahora mismo',
      }))
      return
    }

    const applicationMessage = applicationForms[offerId]?.trim() || ''

    if (applicationMessage.length < 10) {
      setApplicationMessages((currentMessages) => ({
        ...currentMessages,
        [offerId]: 'Escribe un mensaje de al menos 10 caracteres para explicar tu candidatura.',
      }))
      return
    }

    setApplicationMessages((currentMessages) => ({
      ...currentMessages,
      [offerId]: 'Enviando candidatura...',
    }))

    inscribirseOferta(offerId, session.djProfileId, applicationMessage)
      .then((savedApplication) => {
        setDjApplications((currentApplications) => {
          const exists = currentApplications.some(
            (application) => application.jobOfferId === offerId,
          )

          if (exists) {
            return currentApplications.map((application) =>
              application.jobOfferId === offerId ? savedApplication : application,
            )
          }

          return [...currentApplications, savedApplication]
        })
        setApplicationMessages((currentMessages) => ({
          ...currentMessages,
          [offerId]: 'Candidatura enviada correctamente',
        }))
      })
      .catch((requestError) => {
        setApplicationMessages((currentMessages) => ({
          ...currentMessages,
          [offerId]: obtenerMensajeError(requestError),
        }))
      })
  }

  return (
    <main className="section">
      <section className="market-hero">
        <div>
          <p className="eyebrow">Tablon de eventos</p>
          <h1>Ofertas para DJs</h1>
          <p>
            Busca eventos privados, salas y fiestas donde necesitan DJ. Filtra
            por ciudad, presupuesto o experiencia y contacta con quien publica la oferta.
          </p>
        </div>
        <div className="market-hero-panel">
          <span>DJ</span>
          <strong>{offers.length}</strong>
          <p>ofertas visibles ahora mismo</p>
        </div>
      </section>

      <div className="offers-layout">
        <aside className="filters">
          <h2>Filtros</h2>
          <label>
            Ciudad
            <input
              name="city"
              type="text"
              placeholder="Madrid"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Estilo musical
            <select
              name="musicStyleId"
              value={filters.musicStyleId}
              onChange={handleFilterChange}
            >
              <option value="0">Todos</option>
              {musicStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Presupuesto minimo
            <input
              name="minBudget"
              type="number"
              min="0"
              placeholder="200"
              value={filters.minBudget}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Experiencia que puedo cumplir
            <select
              name="maxExperience"
              value={filters.maxExperience}
              onChange={handleFilterChange}
            >
              <option value="0">Todas</option>
              <option value="1">Hasta 1 anio</option>
              <option value="3">Hasta 3 anios</option>
              <option value="5">Hasta 5 anios</option>
              <option value="10">Hasta 10 anios</option>
            </select>
          </label>
          <button className="button secondary" type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </aside>

        <section className="results">
          <div className="results-toolbar">
            <div>
              <h2>Eventos publicados</h2>
              <p className="muted">
                {session?.role === 'dj'
                  ? `Sesion activa: ${session.displayName}`
                  : 'Para inscribirte necesitas iniciar sesion como DJ.'}
              </p>
            </div>
          </div>

          {loading && <p className="muted">Cargando ofertas...</p>}
          {error && <p className="muted">{error}</p>}
          {!loading && !error && offers.length === 0 && (
            <div className="empty-state">
              <strong>No hay ofertas con esos filtros</strong>
              <p>Prueba a limpiar filtros o buscar otra ciudad para ver mas eventos disponibles.</p>
              <button className="button secondary" type="button" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            offers.map((offer) => {
              const organizerUser = getOrganizerUser(offer)
              const currentApplication = getApplicationForOffer(offer.id)
              const canApply =
                session?.role === 'dj' &&
                offer.status === 'open' &&
                (!currentApplication || currentApplication.status === 'withdrawn')
              const contactLink = organizerUser
                ? `/mensajes?userId=${organizerUser.userId}`
                : '/mensajes'

              return (
                <article
                  className={
                    organizerUser?.role === 'private_party'
                      ? 'offer-card private-offer'
                      : 'offer-card'
                  }
                  key={offer.id}
                >
                  <img
                    className="offer-photo"
                    src={offer.imageUrl || heroImage}
                    alt={offer.title}
                  />
                  <div className="offer-content">
                    <div className="card-header">
                      <div>
                        <h2>{offer.title}</h2>
                        <p className="muted">
                          {organizerUser?.displayName || 'Perfil que publica'} -{' '}
                          {organizerUser ? getOrganizerLabel(organizerUser.role) : 'Perfil'} -{' '}
                          {getOfferStatusLabel(offer.status)}
                        </p>
                      </div>
                      <span className="status active">
                        {organizerUser?.role === 'private_party' ? 'Fiesta privada' : 'Evento'}
                      </span>
                    </div>

                    <p>{offer.description}</p>

                    {currentApplication && (
                      <div className="application-state">
                        <strong>{getApplicationLabel(currentApplication.status)}</strong>
                        <span>
                          {currentApplication.status === 'withdrawn'
                            ? 'Puedes volver a inscribirte si sigue abierta.'
                            : 'Puedes revisar esta candidatura en tu panel de DJ.'}
                        </span>
                      </div>
                    )}

                    <div className="offer-meta">
                      <span>Ciudad: {offer.city}</span>
                      <span>Fecha: {offer.eventDate || 'Fecha sin definir'}</span>
                      <span>Presupuesto: {formatBudget(offer.budget)}</span>
                      <span>Duracion: {offer.durationHours || 'Sin duracion'} h</span>
                      <span>Experiencia: +{offer.minExperienceYears || 0} anios</span>
                      <span>Estilo: {getStyleName(offer.musicStyleId)}</span>
                    </div>

                    {session?.role === 'dj' && offer.status === 'open' && (
                      <label className="application-note">
                        Mensaje para quien publica
                        <textarea
                          rows="3"
                          placeholder="Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos."
                          value={applicationForms[offer.id] || ''}
                          onChange={(event) =>
                            handleApplicationMessageChange(offer.id, event.target.value)
                          }
                        />
                      </label>
                    )}

                    <div className="card-actions">
                      <Link className="button secondary" to={`/ofertas/${offer.id}`}>
                        Ver detalle
                      </Link>
                      <button
                        className="button primary"
                        type="button"
                        disabled={session?.role === 'dj' && !canApply}
                        onClick={() => handleApply(offer.id)}
                      >
                        {currentApplication?.status === 'withdrawn'
                          ? 'Volver a inscribirme'
                          : 'Inscribirme'}
                      </button>
                      <Link className="button secondary" to={session ? contactLink : '/login'}>
                        Enviar mensaje
                      </Link>
                    </div>

                    {applicationMessages[offer.id] && (
                      <p className="muted">{applicationMessages[offer.id]}</p>
                    )}
                  </div>
                </article>
              )
            })}
        </section>
      </div>
    </main>
  )
}

export default OffersPage
