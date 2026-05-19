import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  actualizarEstadoCandidatura,
  actualizarEstadoOferta,
  actualizarOferta,
  actualizarOrganizador,
  crearConversacion,
  crearOferta,
  eliminarDjFavorito,
  enviarMensaje,
  listarEstilosMusicales,
  listarCandidaturasOrganizador,
  listarDjs,
  listarDjsFavoritos,
  listarOfertasOrganizador,
  obtenerMensajeError,
  obtenerOrganizadorPorId,
  subirImagen,
} from '../services/api'
import { getSession, saveSession } from '../services/session'

const emptyOfferForm = {
  title: '',
  description: '',
  city: '',
  eventDate: '',
  minExperienceYears: '0',
  budget: '',
  durationHours: '',
  imageUrl: '',
  musicStyleId: '0',
}

const emptyProfileForm = {
  venueName: '',
  city: '',
  province: '',
  venueType: 'other',
  websiteUrl: '',
  logoPhoto: '',
  description: '',
}

function OrganizerDashboardPage() {
  const [session, setSession] = useState(getSession())
  const [organizer, setOrganizer] = useState(null)
  const [offers, setOffers] = useState([])
  const [applications, setApplications] = useState([])
  const [djs, setDjs] = useState([])
  const [favoriteDjs, setFavoriteDjs] = useState([])
  const [musicStyles, setMusicStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [applicationMessage, setApplicationMessage] = useState('')
  const [favoriteMessage, setFavoriteMessage] = useState('')
  const [formData, setFormData] = useState(emptyOfferForm)
  const [profileForm, setProfileForm] = useState(emptyProfileForm)
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [offerStatusFilter, setOfferStatusFilter] = useState('all')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
  const [applicationOfferFilter, setApplicationOfferFilter] = useState('all')
  const offerFormRef = useRef(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  function loadDashboard() {
    const currentSession = getSession()
    setSession(currentSession)

    if (!currentSession || !isOrganizerAccount(currentSession.role) || !currentSession.organizerProfileId) {
      setLoading(false)
      setError('Inicia sesion con una cuenta de particular o fiesta privada para ver este panel')
      return
    }

    setLoading(true)

    Promise.all([
      obtenerOrganizadorPorId(currentSession.organizerProfileId),
      listarOfertasOrganizador(currentSession.organizerProfileId),
      listarCandidaturasOrganizador(currentSession.organizerProfileId),
      listarDjs(),
      listarDjsFavoritos(currentSession.organizerProfileId),
      listarEstilosMusicales(),
    ])
      .then(([organizerData, offersData, applicationsData, djsData, favoriteDjsData, stylesData]) => {
        setOrganizer(organizerData)
        setProfileForm(toProfileForm(organizerData))
        setOffers(offersData)
        setApplications(applicationsData)
        setDjs(djsData)
        setFavoriteDjs(favoriteDjsData)
        setMusicStyles(stylesData)
        setError('')
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function toProfileForm(organizerData) {
    return {
      venueName: organizerData.venueName || '',
      city: organizerData.city || '',
      province: organizerData.province || '',
      venueType: organizerData.venueType || 'other',
      websiteUrl: organizerData.websiteUrl || '',
      logoPhoto: organizerData.logoPhoto || '',
      description: organizerData.description || '',
    }
  }

  function isOrganizerAccount(role) {
    return role === 'organizer' || role === 'private_party'
  }

  function isPrivateParty() {
    return session?.role === 'private_party'
  }

  function getPanelTitle() {
    return isPrivateParty() ? 'Panel de fiesta privada' : 'Panel del particular'
  }

  function getProfileTitle() {
    return isPrivateParty() ? 'Editar perfil de fiesta privada' : 'Editar perfil de particular'
  }

  function getProfileHelpText() {
    return isPrivateParty()
      ? 'Estos datos ayudan a los DJs a entender que tipo de evento o servicio publica ofertas.'
      : 'Estos datos ayudan a los DJs a saber quien les contacta.'
  }

  function getNameLabel() {
    return isPrivateParty() ? 'Nombre de sala, empresa o servicio' : 'Nombre o sala'
  }

  function handleApplicationStatus(application, status) {
    setApplicationMessage('Actualizando candidatura...')

    actualizarEstadoCandidatura(application.id, status)
      .then((updatedApplication) => {
        if (status !== 'accepted') {
          setApplicationMessage('Candidatura actualizada correctamente')
          loadDashboard()
          return null
        }

        return openConversationAfterAccept(application)
          .then(() => {
            setApplicationMessage('Candidatura aceptada y mensaje enviado al DJ')
            loadDashboard()
            return updatedApplication
          })
          .catch(() => {
            setApplicationMessage('Candidatura aceptada, pero no se pudo enviar el mensaje automatico')
            loadDashboard()
            return updatedApplication
          })
      })
      .catch(() => {
        setApplicationMessage('No se ha podido actualizar la candidatura. Comprueba que Spring Boot esta iniciado.')
      })
  }

  function openConversationAfterAccept(application) {
    const dj = djs.find((item) => item.id === application.djProfileId)
    const offer = offers.find((item) => item.id === application.jobOfferId)

    if (!session?.userId || !dj?.userId) {
      return Promise.reject(new Error('Faltan usuarios para abrir la conversacion'))
    }

    return crearConversacion({
      userOneId: session.userId,
      userTwoId: dj.userId,
      djProfileId: dj.id,
      organizerId: session.organizerProfileId,
      jobOfferId: application.jobOfferId,
    }).then((conversation) =>
      enviarMensaje({
        conversationId: conversation.id,
        senderUserId: session.userId,
        body: `Hola ${dj.artistName}, hemos aceptado tu candidatura para "${offer?.title || 'la oferta'}". Podemos hablar por aqui para cerrar los detalles.`,
      }),
    )
  }

  function handleRemoveFavorite(djProfileId) {
    if (!session?.organizerProfileId) {
      setFavoriteMessage('No hay una sesion valida activa')
      return
    }

    setFavoriteMessage('Quitando DJ guardado...')

    eliminarDjFavorito(session.organizerProfileId, djProfileId)
      .then(() => {
        setFavoriteMessage('DJ eliminado de guardados')
        loadDashboard()
      })
      .catch((requestError) => {
        setFavoriteMessage(obtenerMensajeError(requestError))
      })
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleProfileChange(event) {
    const { name, value } = event.target
    setProfileForm({
      ...profileForm,
      [name]: value,
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
          logoPhoto: data.url,
        })
        setProfileMessage('Imagen subida. Guarda el perfil para conservarla.')
      })
      .catch((requestError) => {
        setProfileMessage(obtenerMensajeError(requestError))
      })
  }

  function handleOfferImageUpload(event) {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setFormMessage('Subiendo imagen...')

    subirImagen(file)
      .then((data) => {
        setFormData({
          ...formData,
          imageUrl: data.url,
        })
        setFormMessage('Imagen subida. Publica la oferta para conservarla.')
      })
      .catch((requestError) => {
        setFormMessage(obtenerMensajeError(requestError))
      })
  }

  function handleUpdateProfile(event) {
    event.preventDefault()

    if (!session?.organizerProfileId) {
      setProfileMessage('No hay una sesion valida activa')
      return
    }

    if (profileForm.venueName.trim().length < 3) {
      setProfileMessage('El nombre del perfil debe tener al menos 3 caracteres')
      return
    }

    if (!profileForm.city.trim()) {
      setProfileMessage('La ciudad del perfil es obligatoria')
      return
    }

    setProfileMessage('Guardando perfil...')

    actualizarOrganizador(session.organizerProfileId, {
      ...profileForm,
      venueName: profileForm.venueName.trim(),
      city: profileForm.city.trim(),
      province: profileForm.province.trim(),
      description: profileForm.description.trim(),
    })
      .then((updatedProfile) => {
        setOrganizer(updatedProfile)
        setProfileForm(toProfileForm(updatedProfile))
        setProfileMessage('Perfil actualizado correctamente')

        const updatedSession = {
          ...session,
          displayName: updatedProfile.venueName,
        }
        saveSession(updatedSession)
        setSession(updatedSession)
      })
      .catch(() => {
        setProfileMessage('No se ha podido actualizar el perfil. Comprueba que Spring Boot esta iniciado.')
      })
  }

  function handleCreateOffer(event) {
    event.preventDefault()

    const formError = validateOfferForm()
    if (formError) {
      setFormMessage(formError)
      return
    }

    const offerData = {
      organizerId: session.organizerProfileId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      city: formData.city.trim(),
      eventDate: formData.eventDate || null,
      minExperienceYears: Number(formData.minExperienceYears || 0),
      budget: formData.budget ? Number(formData.budget) : null,
      durationHours: formData.durationHours ? Number(formData.durationHours) : null,
      imageUrl: formData.imageUrl,
      musicStyleId: formData.musicStyleId !== '0' ? Number(formData.musicStyleId) : null,
      status: 'open',
    }

    if (editingOfferId) {
      setFormMessage('Guardando cambios de la oferta...')

      actualizarOferta(editingOfferId, offerData)
        .then(() => {
          setFormMessage('Oferta actualizada correctamente')
          resetOfferForm()
          loadDashboard()
        })
        .catch((requestError) => {
          setFormMessage(obtenerMensajeError(requestError))
        })
      return
    }

    setFormMessage('Creando oferta...')

    crearOferta(offerData)
      .then(() => {
        setFormMessage('Oferta publicada correctamente')
        resetOfferForm()
        loadDashboard()
      })
      .catch((requestError) => {
        setFormMessage(obtenerMensajeError(requestError))
      })
  }

  function validateOfferForm() {
    if (formData.title.trim().length < 5) {
      return 'El titulo debe tener al menos 5 caracteres'
    }

    if (!formData.city.trim()) {
      return 'La ciudad es obligatoria'
    }

    if (formData.description.trim().length < 20) {
      return 'La descripcion debe tener al menos 20 caracteres'
    }

    if (Number(formData.minExperienceYears || 0) < 0) {
      return 'La experiencia minima no puede ser negativa'
    }

    if (formData.budget && Number(formData.budget) < 0) {
      return 'El presupuesto no puede ser negativo'
    }

    if (formData.durationHours && Number(formData.durationHours) < 0) {
      return 'La duracion no puede ser negativa'
    }

    return ''
  }

  function resetOfferForm() {
    setEditingOfferId(null)
    setFormData(emptyOfferForm)
  }

  function handleEditOffer(offer) {
    setEditingOfferId(offer.id)
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      city: offer.city || '',
      eventDate: offer.eventDate || '',
      minExperienceYears: String(offer.minExperienceYears ?? 0),
      budget: offer.budget ?? '',
      durationHours: offer.durationHours ?? '',
      imageUrl: offer.imageUrl || '',
      musicStyleId: offer.musicStyleId ? String(offer.musicStyleId) : '0',
    })
    setFormMessage(`Editando oferta: ${offer.title}`)
    offerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleOfferStatus(offerId, status) {
    setFormMessage('Actualizando estado de oferta...')

    actualizarEstadoOferta(offerId, status)
      .then(() => {
        setFormMessage('Estado de oferta actualizado correctamente')
        loadDashboard()
      })
      .catch((requestError) => {
        setFormMessage(obtenerMensajeError(requestError))
      })
  }

  function getStatusLabel(status) {
    if (status === 'open') {
      return 'Abierta'
    }

    if (status === 'closed') {
      return 'Cerrada'
    }

    if (status === 'cancelled') {
      return 'Cancelada'
    }

    return status
  }

  function getApplicationStatusLabel(status) {
    if (status === 'pending') {
      return 'Pendiente'
    }

    if (status === 'accepted') {
      return 'Aceptada'
    }

    if (status === 'rejected') {
      return 'Rechazada'
    }

    if (status === 'withdrawn') {
      return 'Retirada'
    }

    return status
  }

  function getApplicationsForOffer(offerId) {
    return applications.filter((application) => application.jobOfferId === offerId)
  }

  const filteredOffers = offers.filter((offer) => {
    if (offerStatusFilter === 'all') {
      return true
    }

    return offer.status === offerStatusFilter
  })

  const filteredApplications = applications.filter((application) => {
    const statusMatches =
      applicationStatusFilter === 'all' || application.status === applicationStatusFilter
    const offerMatches =
      applicationOfferFilter === 'all' || application.jobOfferId === Number(applicationOfferFilter)

    return statusMatches && offerMatches
  })

  const acceptedApplications = applications.filter(
    (application) => application.status === 'accepted',
  ).length
  const rejectedApplications = applications.filter(
    (application) => application.status === 'rejected',
  ).length

  function getApplicationStatusClass(status) {
    if (status === 'accepted') {
      return 'status active'
    }

    if (status === 'rejected' || status === 'withdrawn') {
      return 'status danger'
    }

    return 'status warning'
  }

  const pendingApplications = applications.filter(
    (application) => application.status === 'pending',
  ).length

  return (
    <main className="section">
      <section className={isPrivateParty() ? 'panel-hero private-party-hero' : 'panel-hero'}>
        <div>
          <p className="eyebrow">Panel privado</p>
          <h1>{getPanelTitle()}</h1>
          <p>
            {isPrivateParty()
              ? 'Publica eventos, recibe candidaturas de DJs y usa mensajes solo con DJs.'
              : 'Publica ofertas, revisa candidaturas y contacta con DJs.'}
          </p>
        </div>
        <span>{isPrivateParty() ? 'Fiesta privada' : 'Particular'}</span>
      </section>

      {!isOrganizerAccount(session?.role) && (
        <Link className="button primary" to="/login">
          Iniciar sesion
        </Link>
      )}
      {loading && <p className="muted">Cargando panel...</p>}
      {error && <p className="muted">{error}</p>}

      <div className="dashboard-grid">
        <article className="module-card metric-card">
          <span>Ofertas abiertas</span>
          <strong>{offers.filter((offer) => offer.status === 'open').length}</strong>
          <p>{applications.length} candidaturas recibidas</p>
        </article>
        <article className="module-card metric-card">
          <span>Candidaturas pendientes</span>
          <strong>{pendingApplications}</strong>
          <p>Solicitudes que faltan por revisar</p>
        </article>
        <article className="module-card metric-card">
          <span>Aceptadas</span>
          <strong>{acceptedApplications}</strong>
          <p>Candidatos con conversacion abierta</p>
        </article>
        <article className="module-card metric-card">
          <span>Rechazadas</span>
          <strong>{rejectedApplications}</strong>
          <p>Candidaturas descartadas</p>
        </article>
        <article className="module-card metric-card image-metric">
          {organizer?.logoPhoto ? (
            <img src={organizer.logoPhoto} alt={organizer.venueName} />
          ) : (
            <div className="image-placeholder">{isPrivateParty() ? 'Fiesta' : 'Local'}</div>
          )}
          <span>Perfil</span>
          <strong>{organizer?.venueName || (isPrivateParty() ? 'Fiesta privada' : 'Particular')}</strong>
          <p>{organizer ? `${organizer.city} - ${organizer.venueType}` : 'Sin datos'}</p>
        </article>
        <article className="module-card metric-card">
          <span>Buscar DJs</span>
          <strong>{favoriteDjs.length}</strong>
          <p>DJs guardados para revisar despues</p>
        </article>
      </div>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>DJs guardados</h2>
            <p className="muted">
              Seleccion de DJs que puedes revisar, contactar o valorar desde su perfil.
            </p>
          </div>
          <Link className="button secondary" to="/buscar-djs">
            Buscar mas DJs
          </Link>
        </div>

        {favoriteMessage && <p className="muted">{favoriteMessage}</p>}
        {favoriteDjs.length === 0 && (
          <div className="empty-state">
            <strong>No tienes DJs guardados</strong>
            <p>Entra en el buscador, abre un perfil y pulsa Guardar DJ para tenerlo aqui.</p>
            <Link className="button secondary" to="/buscar-djs">
              Buscar DJs
            </Link>
          </div>
        )}

        <div className="mini-offer-grid">
          {favoriteDjs.map((favoriteDj) => (
            <article className="mini-offer-card" key={favoriteDj.id}>
              {favoriteDj.profilePhoto ? (
                <img
                  className="mini-offer-image"
                  src={favoriteDj.profilePhoto}
                  alt={favoriteDj.artistName}
                />
              ) : (
                <div className="image-placeholder">DJ</div>
              )}
              <h3>{favoriteDj.artistName}</h3>
              <p className="muted">
                {favoriteDj.city} - {favoriteDj.experienceYears} anios - {favoriteDj.avgRating || 0}/5
              </p>
              <div className="card-actions">
                <Link className="button secondary" to={`/djs/${favoriteDj.id}`}>
                  Ver perfil
                </Link>
                <Link className="button secondary" to={`/mensajes?userId=${favoriteDj.userId}`}>
                  Enviar mensaje
                </Link>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => handleRemoveFavorite(favoriteDj.id)}
                >
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>{getProfileTitle()}</h2>
            <p className="muted">{getProfileHelpText()}</p>
          </div>
          <Link className="button secondary" to="/buscar-djs">
            Buscar DJs
          </Link>
        </div>

        <form className="form form-wide" onSubmit={handleUpdateProfile}>
          <label>
            {getNameLabel()}
            <input
              name="venueName"
              type="text"
              value={profileForm.venueName}
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
            Tipo
            <select
              name="venueType"
              value={profileForm.venueType}
              onChange={handleProfileChange}
            >
              <option value="private_party">Fiesta privada</option>
              <option value="private">Evento privado</option>
              <option value="club">Club o sala</option>
              <option value="company">Empresa</option>
              <option value="other">Otro</option>
            </select>
          </label>
          <label className="full-width">
            Web
            <input
              name="websiteUrl"
              type="url"
              value={profileForm.websiteUrl}
              onChange={handleProfileChange}
            />
          </label>
          <label className="full-width">
            {isPrivateParty() ? 'Foto o logo de la fiesta privada' : 'Foto o logo del particular/empresa'}
            <input
              name="logoPhoto"
              type="url"
              placeholder="https://..."
              value={profileForm.logoPhoto}
              onChange={handleProfileChange}
            />
          </label>
          <div className="upload-panel full-width">
            <div>
              <strong>Subir foto</strong>
              <p className="muted">
                {isPrivateParty()
                  ? 'Puede ser logo, foto de sala, cartel o imagen del evento.'
                  : 'Puede ser logo, foto de sala o imagen del perfil.'}
              </p>
            </div>
            <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
          </div>
          {profileForm.logoPhoto && (
            <div className="image-preview full-width">
              <img src={profileForm.logoPhoto} alt="Vista previa del perfil" />
            </div>
          )}
          <label className="full-width">
            Descripcion
            <textarea
              name="description"
              value={profileForm.description}
              onChange={handleProfileChange}
              rows="4"
            />
          </label>
          <div className="form-actions full-width">
            <button className="button primary" type="submit">
              Guardar perfil
            </button>
            {profileMessage && <p className="muted">{profileMessage}</p>}
          </div>
        </form>
      </section>

      <section className="content-block dashboard-section" ref={offerFormRef}>
        <div className="section-title">
          <div>
            <h2>{editingOfferId ? 'Editar oferta' : 'Publicar nueva oferta'}</h2>
            <p className="muted">
              {editingOfferId
                ? 'Modifica los datos principales de la oferta seleccionada.'
                : 'Crea una oferta para que los DJs puedan inscribirse.'}
            </p>
          </div>
          {editingOfferId && (
            <button className="button secondary" type="button" onClick={resetOfferForm}>
              Cancelar edicion
            </button>
          )}
        </div>
        {editingOfferId && (
          <div className="edit-notice">
            <strong>Modo edicion activo</strong>
            <p>Estas modificando una oferta existente. Cuando termines, pulsa Guardar cambios.</p>
          </div>
        )}
        <form className="form form-wide" onSubmit={handleCreateOffer}>
          <label>
            Titulo
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Ciudad
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Estilo musical
            <select
              name="musicStyleId"
              value={formData.musicStyleId}
              onChange={handleInputChange}
            >
              <option value="0">Sin estilo concreto</option>
              {musicStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha del evento
            <input
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Experiencia minima
            <select
              name="minExperienceYears"
              value={formData.minExperienceYears}
              onChange={handleInputChange}
            >
              <option value="0">Sin requisito</option>
              <option value="1">+1 anio</option>
              <option value="3">+3 anios</option>
              <option value="5">+5 anios</option>
            </select>
          </label>
          <label>
            Presupuesto
            <input
              name="budget"
              type="number"
              min="0"
              value={formData.budget}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Duracion en horas
            <input
              name="durationHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.durationHours}
              onChange={handleInputChange}
            />
          </label>
          <label className="full-width">
            Foto de la fiesta o evento
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </label>
          <div className="upload-panel full-width">
            <div>
              <strong>Subir foto del evento</strong>
              <p className="muted">Sirve para que la oferta destaque en el tablon.</p>
            </div>
            <input type="file" accept="image/*" onChange={handleOfferImageUpload} />
          </div>
          {formData.imageUrl && (
            <div className="image-preview full-width">
              <img src={formData.imageUrl} alt="Vista previa del evento" />
            </div>
          )}
          <label className="full-width">
            Descripcion
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </label>
          <div className="form-actions full-width">
            <button className="button primary" type="submit">
              {editingOfferId ? 'Guardar cambios' : 'Publicar oferta'}
            </button>
            {formMessage && <p className="muted">{formMessage}</p>}
          </div>
        </form>
      </section>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>Ofertas publicadas</h2>
            <p className="muted">
              Gestiona tus ofertas sin borrarlas: puedes editarlas, cerrarlas, reabrirlas o cancelarlas.
            </p>
          </div>
          <div className="offer-management-toolbar">
            <select
              value={offerStatusFilter}
              onChange={(event) => setOfferStatusFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="open">Abiertas</option>
              <option value="closed">Cerradas</option>
              <option value="cancelled">Canceladas</option>
            </select>
            <span className="status active">{filteredOffers.length}</span>
          </div>
        </div>
        {filteredOffers.length === 0 && (
          <div className="empty-state">
            <strong>No hay ofertas con este estado</strong>
            <p>Publica una oferta nueva o cambia el filtro para ver otras ofertas.</p>
          </div>
        )}
        <div className="list">
          {filteredOffers.map((offer) => {
            const offerApplications = getApplicationsForOffer(offer.id)
            const offerPendingApplications = offerApplications.filter(
              (application) => application.status === 'pending',
            ).length
            const offerAcceptedApplications = offerApplications.filter(
              (application) => application.status === 'accepted',
            ).length

            return (
              <article className="list-card" key={offer.id}>
                {offer.imageUrl && (
                  <img className="list-card-image" src={offer.imageUrl} alt={offer.title} />
                )}
                <div className="card-header">
                  <div>
                    <h3>{offer.title}</h3>
                    <p className="muted">
                      {offer.city} - {offer.eventDate || 'Fecha sin definir'} - {getStatusLabel(offer.status)}
                    </p>
                  </div>
                  <span className={offer.status === 'open' ? 'status active' : 'status warning'}>
                    {getStatusLabel(offer.status)}
                  </span>
                </div>
                <p>{offer.description}</p>
                <div className="application-state">
                  <strong>{offerApplications.length} candidaturas para esta oferta</strong>
                  <span>
                    {offerPendingApplications} pendientes - {offerAcceptedApplications} aceptadas
                  </span>
                </div>
                <div className="offer-meta">
                  <span>Presupuesto: {offer.budget || 'No indicado'} euros</span>
                  <span>Duracion: {offer.durationHours || 'Sin indicar'} h</span>
                  <span>Experiencia: +{offer.minExperienceYears || 0} anios</span>
                </div>
                <div className="card-actions">
                  <Link className="button secondary" to={`/ofertas/${offer.id}`}>
                    Ver detalle
                  </Link>
                  <button className="button secondary" type="button" onClick={() => handleEditOffer(offer)}>
                    Editar
                  </button>
                  {offer.status === 'open' ? (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer.id, 'closed')}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer.id, 'open')}
                    >
                      Reabrir
                    </button>
                  )}
                  {offer.status !== 'cancelled' && (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer.id, 'cancelled')}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="content-block dashboard-section">
        <div className="section-title">
          <div>
            <h2>Candidaturas recibidas</h2>
            <p className="muted">Filtra candidatos por estado y entra al perfil del DJ antes de aceptar.</p>
          </div>
          <div className="offer-management-toolbar">
            <select
              value={applicationOfferFilter}
              onChange={(event) => setApplicationOfferFilter(event.target.value)}
            >
              <option value="all">Todas las ofertas</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.title}
                </option>
              ))}
            </select>
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
            <span className="status active">{filteredApplications.length}</span>
          </div>
        </div>
        {filteredApplications.length === 0 && (
          <div className="empty-state">
            <strong>Todavia no hay candidaturas recibidas</strong>
            <p>Cuando un DJ se inscriba en una oferta, aparecera aqui para aceptarlo o rechazarlo.</p>
          </div>
        )}
        {applicationMessage && <p className="muted">{applicationMessage}</p>}
        <div className="list">
          {filteredApplications.map((application) => {
            const offer = offers.find((item) => item.id === application.jobOfferId)
            const dj = djs.find((item) => item.id === application.djProfileId)

            return (
              <article className="list-card" key={application.id}>
                <div className="card-header">
                  <div>
                    <h3>{offer?.title || 'Oferta no encontrada'}</h3>
                    <p className="muted">{dj?.artistName || `DJ #${application.djProfileId}`}</p>
                  </div>
                  <span className={getApplicationStatusClass(application.status)}>
                    {getApplicationStatusLabel(application.status)}
                  </span>
                </div>
                <p>{application.message || 'Sin mensaje del DJ.'}</p>
                <div className="card-actions">
                  {dj?.id && (
                    <Link className="button secondary" to={`/djs/${dj.id}`}>
                      Ver perfil DJ
                    </Link>
                  )}
                  {dj?.userId && (
                    <Link className="button secondary" to={`/mensajes?userId=${dj.userId}`}>
                      Enviar mensaje
                    </Link>
                  )}
                  {application.status === 'pending' && (
                    <>
                      <button
                        className="button primary"
                        type="button"
                        onClick={() => handleApplicationStatus(application, 'accepted')}
                      >
                        Aceptar
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleApplicationStatus(application, 'rejected')}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {application.status !== 'pending' && application.status !== 'withdrawn' && (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleApplicationStatus(application, 'pending')}
                    >
                      Marcar pendiente
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default OrganizerDashboardPage
