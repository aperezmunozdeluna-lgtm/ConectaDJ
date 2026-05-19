import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  actualizarEstadoCandidatura,
  actualizarDjProfile,
  listarCandidaturasDj,
  listarOfertas,
  listarUsuarios,
  obtenerMensajeError,
  obtenerDjPorId,
  subirImagen,
} from '../services/api'
import { getSession, saveSession } from '../services/session'

const statusLabels = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  withdrawn: 'Retirada',
}

const emptyProfileForm = {
  artistName: '',
  city: '',
  province: '',
  bio: '',
  experienceYears: '0',
  feePerSession: '',
  instagramUrl: '',
  soundcloudUrl: '',
  mixcloudUrl: '',
  profilePhoto: '',
  available: true,
}

function DjDashboardPage() {
  const [session, setSession] = useState(getSession())
  const [dj, setDj] = useState(null)
  const [applications, setApplications] = useState([])
  const [offers, setOffers] = useState([])
  const [users, setUsers] = useState([])
  const [profileForm, setProfileForm] = useState(emptyProfileForm)
  const [profileMessage, setProfileMessage] = useState('')
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  function loadDashboard() {
    const currentSession = getSession()
    setSession(currentSession)

    if (!currentSession || currentSession.role !== 'dj' || !currentSession.djProfileId) {
      setLoading(false)
      setError('Inicia sesion como DJ para ver este panel')
      return
    }

    Promise.all([
      obtenerDjPorId(currentSession.djProfileId),
      listarCandidaturasDj(currentSession.djProfileId),
      listarOfertas({ status: 'all' }),
      listarUsuarios(),
    ])
      .then(([djData, applicationsData, offersData, usersData]) => {
        setDj(djData)
        setProfileForm(toProfileForm(djData))
        setApplications(applicationsData)
        setOffers(offersData)
        setUsers(usersData)
        setError('')
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function toProfileForm(djData) {
    return {
      artistName: djData.artistName || '',
      city: djData.city || '',
      province: djData.province || '',
      bio: djData.bio || '',
      experienceYears: String(djData.experienceYears ?? 0),
      feePerSession: djData.feePerSession ?? '',
      instagramUrl: djData.instagramUrl || '',
      soundcloudUrl: djData.soundcloudUrl || '',
      mixcloudUrl: djData.mixcloudUrl || '',
      profilePhoto: djData.profilePhoto || '',
      available: Boolean(djData.available),
    }
  }

  function handleProfileChange(event) {
    const { name, value, type, checked } = event.target

    setProfileForm({
      ...profileForm,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  function handleProfileImageUpload(event) {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setProfileMessage('Subiendo imagen...')

    subirImagen(file)
      .then((data) => {
        setProfileForm({
          ...profileForm,
          profilePhoto: data.url,
        })
        setProfileMessage('Imagen subida. Guarda el perfil para conservarla.')
      })
      .catch((requestError) => {
        setProfileMessage(obtenerMensajeError(requestError))
      })
  }

  function handleWithdrawApplication(applicationId) {
    setApplicationMessage('Retirando candidatura...')

    actualizarEstadoCandidatura(applicationId, 'withdrawn')
      .then(() => {
        setApplicationMessage('Candidatura retirada correctamente')
        loadDashboard()
      })
      .catch(() => {
        setApplicationMessage('No se ha podido retirar la candidatura')
      })
  }

  function handleUpdateProfile(event) {
    event.preventDefault()

    if (!session?.djProfileId) {
      setProfileMessage('No hay una sesion de DJ activa')
      return
    }

    if (profileForm.artistName.trim().length < 3) {
      setProfileMessage('El nombre artistico debe tener al menos 3 caracteres')
      return
    }

    if (!profileForm.city.trim()) {
      setProfileMessage('La ciudad es obligatoria')
      return
    }

    if (Number(profileForm.experienceYears || 0) < 0) {
      setProfileMessage('Los anos de experiencia no pueden ser negativos')
      return
    }

    if (profileForm.feePerSession && Number(profileForm.feePerSession) < 0) {
      setProfileMessage('El precio por sesion no puede ser negativo')
      return
    }

    setProfileMessage('Guardando perfil...')

    actualizarDjProfile(session.djProfileId, {
      artistName: profileForm.artistName.trim(),
      city: profileForm.city.trim(),
      province: profileForm.province.trim(),
      bio: profileForm.bio.trim(),
      experienceYears: Number(profileForm.experienceYears || 0),
      feePerSession: profileForm.feePerSession ? Number(profileForm.feePerSession) : null,
      instagramUrl: profileForm.instagramUrl,
      soundcloudUrl: profileForm.soundcloudUrl,
      mixcloudUrl: profileForm.mixcloudUrl,
      profilePhoto: profileForm.profilePhoto,
      available: profileForm.available,
    })
      .then((updatedProfile) => {
        setDj(updatedProfile)
        setProfileForm(toProfileForm(updatedProfile))
        setProfileMessage('Perfil actualizado correctamente')

        const updatedSession = {
          ...session,
          displayName: updatedProfile.artistName,
        }
        saveSession(updatedSession)
        setSession(updatedSession)
      })
      .catch(() => {
        setProfileMessage('No se ha podido actualizar el perfil. Comprueba que Spring Boot esta iniciado.')
      })
  }

  const appliedOffers = applications.map((application) => {
    const offer = offers.find((item) => item.id === application.jobOfferId)
    const organizerUser = users.find(
      (user) =>
        (user.role === 'organizer' || user.role === 'private_party') &&
        user.profileId === offer?.organizerId,
    )

    return {
      ...application,
      offer,
      organizerUser,
    }
  })

  const filteredAppliedOffers = appliedOffers.filter((application) => {
    if (applicationStatusFilter === 'all') {
      return true
    }

    return application.status === applicationStatusFilter
  })

  const pendingApplications = applications.filter(
    (application) => application.status === 'pending',
  ).length
  const acceptedApplications = applications.filter(
    (application) => application.status === 'accepted',
  ).length
  const recommendedOffers = offers
    .filter((offer) => offer.status === 'open')
    .filter((offer) => {
      if (!dj) {
        return false
      }

      const sameCity = offer.city?.toLowerCase() === dj.city?.toLowerCase()
      const hasExperience = Number(dj.experienceYears || 0) >= Number(offer.minExperienceYears || 0)
      const alreadyApplied = applications.some((application) => application.jobOfferId === offer.id)

      return sameCity && hasExperience && !alreadyApplied
    })
    .slice(0, 3)

  return (
    <main className="section">
      <section className="panel-hero dj-panel-hero">
        <div>
          <p className="eyebrow">Panel privado</p>
          <h1>Panel del DJ</h1>
          <p>
            Edita tu perfil, revisa candidaturas y encuentra ofertas que encajan
            con tu ciudad y experiencia.
          </p>
        </div>
        <span>{dj?.available ? 'Disponible' : 'No disponible'}</span>
      </section>
      {session?.role !== 'dj' && (
        <Link className="button primary" to="/login">
          Iniciar sesion como DJ
        </Link>
      )}
      {loading && <p className="muted">Cargando panel...</p>}
      {error && <p className="muted">{error}</p>}

      <div className="dashboard-grid">
        <article className="module-card metric-card image-metric">
          {dj?.profilePhoto ? (
            <img src={dj.profilePhoto} alt={dj.artistName} />
          ) : (
            <div className="image-placeholder">DJ</div>
          )}
          <span>Perfil</span>
          <strong>{dj?.artistName || 'DJ'}</strong>
          <p>{dj ? `${dj.city} - ${dj.experienceYears} anios de experiencia` : 'Sin datos'}</p>
        </article>
        <article className="module-card metric-card">
          <span>Candidaturas</span>
          <strong>{applications.length}</strong>
          <p>Solicitudes enviadas a ofertas</p>
        </article>
        <article className="module-card metric-card">
          <span>Pendientes</span>
          <strong>{pendingApplications}</strong>
          <p>Esperando respuesta de quien publica</p>
        </article>
        <article className="module-card metric-card">
          <span>Aceptadas</span>
          <strong>{acceptedApplications}</strong>
          <p>Contacta por mensajes para cerrar detalles</p>
        </article>
        <article className="module-card metric-card">
          <span>Disponibilidad</span>
          <strong>{dj?.available ? 'Disponible' : 'No disponible'}</strong>
          <p>Se muestra en el buscador de DJs</p>
        </article>
      </div>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>Ofertas recomendadas</h2>
            <p className="muted">
              Se muestran ofertas abiertas de tu ciudad para las que cumples la experiencia minima.
            </p>
          </div>
          <Link className="button secondary" to="/ofertas">
            Ver todas las ofertas
          </Link>
        </div>

        {recommendedOffers.length === 0 && (
          <div className="empty-state">
            <strong>No hay recomendaciones directas</strong>
            <p>Revisa el tablon completo para encontrar ofertas de otras ciudades o con otros requisitos.</p>
            <Link className="button secondary" to="/ofertas">
              Ver ofertas
            </Link>
          </div>
        )}

        <div className="mini-offer-grid">
          {recommendedOffers.map((offer) => (
            <article className="mini-offer-card" key={offer.id}>
              {offer.imageUrl ? (
                <img className="mini-offer-image" src={offer.imageUrl} alt={offer.title} />
              ) : (
                <div className="image-placeholder">Oferta</div>
              )}
              <h3>{offer.title}</h3>
              <p className="muted">
                {offer.city} - {offer.eventDate || 'Fecha sin definir'}
              </p>
              <Link className="button secondary" to={`/ofertas/${offer.id}`}>
                Ver oferta
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>Editar perfil profesional</h2>
            <p className="muted">Estos datos son los que ve un particular o fiesta privada cuando busca DJs.</p>
          </div>
          {dj && (
            <Link className="button secondary" to={`/djs/${dj.id}`}>
              Ver perfil publico
            </Link>
          )}
        </div>

        <form className="form form-wide" onSubmit={handleUpdateProfile}>
          <label>
            Nombre artistico
            <input
              name="artistName"
              type="text"
              value={profileForm.artistName}
              onChange={handleProfileChange}
              required
            />
          </label>
          <label>
            Ciudad
            <input
              name="city"
              type="text"
              value={profileForm.city}
              onChange={handleProfileChange}
              required
            />
          </label>
          <label>
            Provincia
            <input
              name="province"
              type="text"
              value={profileForm.province}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Anos de experiencia
            <input
              name="experienceYears"
              type="number"
              min="0"
              value={profileForm.experienceYears}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Precio por sesion
            <input
              name="feePerSession"
              type="number"
              min="0"
              step="0.01"
              value={profileForm.feePerSession}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Instagram
            <input
              name="instagramUrl"
              type="url"
              value={profileForm.instagramUrl}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            SoundCloud
            <input
              name="soundcloudUrl"
              type="url"
              value={profileForm.soundcloudUrl}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Mixcloud
            <input
              name="mixcloudUrl"
              type="url"
              value={profileForm.mixcloudUrl}
              onChange={handleProfileChange}
            />
          </label>
          <label className="full-width">
            Foto del DJ
            <input
              name="profilePhoto"
              type="url"
              placeholder="https://..."
              value={profileForm.profilePhoto}
              onChange={handleProfileChange}
            />
          </label>
          <div className="upload-panel full-width">
            <div>
              <strong>Subir foto</strong>
              <p className="muted">Elige una imagen JPG o PNG. Luego pulsa Guardar perfil.</p>
            </div>
            <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
          </div>
          {profileForm.profilePhoto && (
            <div className="image-preview full-width">
              <img src={profileForm.profilePhoto} alt="Vista previa del DJ" />
            </div>
          )}
          <label className="full-width">
            Biografia
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              rows="4"
            />
          </label>
          <label className="checkbox-label full-width">
            <input
              name="available"
              type="checkbox"
              checked={profileForm.available}
              onChange={handleProfileChange}
            />
            Disponible para nuevos eventos
          </label>
          <div className="form-actions full-width">
            <button className="button primary" type="submit">
              Guardar perfil
            </button>
            {profileMessage && <p className="muted">{profileMessage}</p>}
          </div>
        </form>
      </section>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>Candidaturas enviadas</h2>
            <p className="muted">
              Filtra tus candidaturas para saber que ofertas debes revisar primero.
            </p>
          </div>
          <div className="offer-management-toolbar">
            <select
              value={applicationStatusFilter}
              onChange={(event) => setApplicationStatusFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="withdrawn">Retiradas</option>
            </select>
            <span className="status active">{filteredAppliedOffers.length}</span>
          </div>
        </div>

        {appliedOffers.length === 0 && (
          <div className="empty-state">
            <strong>Todavia no te has inscrito en ninguna oferta</strong>
            <p>Entra en el tablon de ofertas, revisa eventos abiertos y envia tu candidatura.</p>
            <Link className="button secondary" to="/ofertas">
              Ver ofertas
            </Link>
          </div>
        )}
        {appliedOffers.length > 0 && filteredAppliedOffers.length === 0 && (
          <p className="muted">No hay candidaturas con este estado.</p>
        )}
        {applicationMessage && <p className="muted">{applicationMessage}</p>}

        <div className="list">
          {filteredAppliedOffers.map((application) => (
            <article className="list-card" key={application.id}>
              <div className="card-header">
                <div>
                  <h3>{application.offer?.title || 'Oferta no disponible'}</h3>
                  <p className="muted">
                    {application.offer?.city || 'Ciudad no indicada'} -{' '}
                    {application.offer?.eventDate || 'Fecha sin definir'}
                  </p>
                </div>
                <span className={application.status === 'accepted' ? 'status active' : 'status warning'}>
                  {statusLabels[application.status] || application.status}
                </span>
              </div>
              <p className="muted">
                {application.offer?.description || 'Sin descripcion de la oferta.'}
              </p>
              <div className="card-actions">
                {application.offer && (
                  <Link className="button secondary" to={`/ofertas/${application.offer.id}`}>
                    Ver oferta
                  </Link>
                )}
                {application.status === 'pending' && (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => handleWithdrawApplication(application.id)}
                  >
                    Retirar candidatura
                  </button>
                )}
                {application.status === 'withdrawn' && application.offer?.status === 'open' && (
                  <Link className="button primary" to={`/ofertas/${application.offer.id}`}>
                    Volver a inscribirme
                  </Link>
                )}
                {application.status === 'accepted' && application.organizerUser?.userId && (
                  <Link
                    className="button primary"
                    to={`/mensajes?userId=${application.organizerUser.userId}`}
                  >
                    Enviar mensaje
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DjDashboardPage
