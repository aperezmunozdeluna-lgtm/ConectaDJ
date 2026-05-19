import { useEffect, useState } from 'react'
import {
  actualizarEstadoOfertaAdmin,
  actualizarUsuarioActivo,
  listarOfertasAdmin,
  listarUsuariosAdmin,
  obtenerMensajeError,
  obtenerResumenAdmin,
} from '../services/api'
import { getSession } from '../services/session'

const statusLabels = {
  open: 'Abierta',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
}

const roleLabels = {
  dj: 'DJ',
  organizer: 'Particular o sala',
  private_party: 'Fiesta privada',
  admin: 'Administrador',
}

function AdminDashboardPage() {
  const session = getSession()
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [offers, setOffers] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session?.role === 'admin') {
      loadAdminData()
    }
  }, [session?.role])

  function loadAdminData() {
    setMessage('Cargando panel...')

    Promise.all([obtenerResumenAdmin(), listarUsuariosAdmin(), listarOfertasAdmin()])
      .then(([summaryData, usersData, offersData]) => {
        setSummary(summaryData)
        setUsers(usersData)
        setOffers(offersData)
        setMessage('')
      })
      .catch((error) => {
        setMessage(obtenerMensajeError(error))
      })
  }

  function handleUserActive(user, active) {
    setMessage('Actualizando usuario...')

    actualizarUsuarioActivo(user.userId, active)
      .then(() => loadAdminData())
      .catch((error) => setMessage(obtenerMensajeError(error)))
  }

  function handleOfferStatus(offer, status) {
    setMessage('Actualizando oferta...')

    actualizarEstadoOfertaAdmin(offer.id, status)
      .then(() => loadAdminData())
      .catch((error) => setMessage(obtenerMensajeError(error)))
  }

  if (!session || session.role !== 'admin') {
    return (
      <main className="section">
        <section className="content-block">
          <p className="eyebrow">Administracion</p>
          <h1>Panel de administracion</h1>
          <p className="muted">Para entrar aqui inicia sesion con una cuenta de administrador.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="section">
      <section className="panel-hero admin-hero">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Panel de administracion</h1>
          <p>
            Revision sencilla de usuarios, DJs, ofertas, candidaturas y conversaciones. Solo una
            cuenta con rol administrador puede cargar estos datos.
          </p>
        </div>
        <span>Acceso protegido</span>
      </section>

      {summary && (
        <section className="admin-summary">
          <article>
            <span>Usuarios</span>
            <strong>{summary.users}</strong>
          </article>
          <article>
            <span>DJs</span>
            <strong>{summary.djs}</strong>
          </article>
          <article>
            <span>Particulares y fiestas</span>
            <strong>{summary.organizers}</strong>
          </article>
          <article>
            <span>Ofertas</span>
            <strong>{summary.offers}</strong>
          </article>
          <article>
            <span>Candidaturas</span>
            <strong>{summary.applications}</strong>
          </article>
          <article>
            <span>Conversaciones</span>
            <strong>{summary.conversations}</strong>
          </article>
        </section>
      )}

      {message && <p className="detail-message admin-message">{message}</p>}

      <section className="admin-layout">
        <div className="content-block">
          <div className="section-title">
            <div>
              <p className="eyebrow">Usuarios</p>
              <h2>Gestion de cuentas</h2>
            </div>
          </div>

          <div className="admin-list">
            {users.map((user) => (
              <article className="admin-row" key={user.userId}>
                <div className="admin-row-main">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.displayName} />
                  ) : (
                    <strong>{user.displayName?.charAt(0) || 'U'}</strong>
                  )}
                  <div>
                    <h3>{user.displayName}</h3>
                    <p className="muted">{user.email}</p>
                    <span className="chip">{roleLabels[user.role] || user.role}</span>
                  </div>
                </div>
                <div className="admin-actions">
                  <span className={user.active ? 'status active' : 'status warning'}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                  {user.userId === session.userId ? (
                    <button className="button secondary" type="button" disabled>
                      Cuenta actual
                    </button>
                  ) : (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleUserActive(user, !user.active)}
                    >
                      {user.active ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-block">
          <div className="section-title">
            <div>
              <p className="eyebrow">Ofertas</p>
              <h2>Estado de publicaciones</h2>
            </div>
          </div>

          <div className="admin-list">
            {offers.map((offer) => (
              <article className="admin-row offer-admin-row" key={offer.id}>
                <div className="admin-row-main">
                  {offer.imageUrl ? (
                    <img src={offer.imageUrl} alt={offer.title} />
                  ) : (
                    <strong>DJ</strong>
                  )}
                  <div>
                    <h3>{offer.title}</h3>
                    <p className="muted">
                      {offer.city} - {offer.eventDate || 'Sin fecha'} - {offer.budget || 0} euros
                    </p>
                    <span className={`status ${offer.status === 'open' ? 'active' : 'warning'}`}>
                      {statusLabels[offer.status] || offer.status}
                    </span>
                  </div>
                </div>
                <div className="admin-actions">
                  {offer.status === 'open' ? (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer, 'closed')}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer, 'open')}
                    >
                      Reabrir
                    </button>
                  )}
                  {offer.status !== 'cancelled' && (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleOfferStatus(offer, 'cancelled')}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboardPage
