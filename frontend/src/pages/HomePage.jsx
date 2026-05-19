import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DjCard from '../components/DjCard'
import heroImage from '../assets/hero.png'
import { listarDjs, listarOfertas } from '../services/api'

function HomePage() {
  const [featuredDjs, setFeaturedDjs] = useState([])
  const [recentOffers, setRecentOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listarDjs(), listarOfertas()])
      .then(([djsData, offersData]) => {
        setFeaturedDjs(djsData.slice(0, 3))
        setRecentOffers(offersData.slice(0, 3))
      })
      .catch(() => {
        setFeaturedDjs([])
        setRecentOffers([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main>
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.52)), url(${heroImage})`,
        }}
      >
        <div className="hero-copy">
          <p className="eyebrow">ConectaDJ para eventos, salas y fiestas privadas</p>
          <h1>Conecta DJs con personas y empresas que necesitan musica para su evento</h1>
          <p>
            Una web sencilla tipo InfoJobs: el DJ crea su perfil, busca ofertas y
            se inscribe. El particular o la fiesta privada publica eventos, encuentra
            DJs y habla por mensajeria.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/buscar-djs">
              Buscar DJs
            </Link>
            <Link className="button secondary" to="/ofertas">
              Ver ofertas
            </Link>
          </div>
        </div>
      </section>

      <section className="section compact-section">
        <div className="stat-grid">
          <article className="stat-item">
            <strong>{featuredDjs.length}</strong>
            <span>DJs destacados</span>
          </article>
          <article className="stat-item">
            <strong>{recentOffers.length}</strong>
            <span>Ofertas recientes</span>
          </article>
          <article className="stat-item">
            <strong>REST</strong>
            <span>React, Spring Boot y MySQL</span>
          </article>
        </div>
      </section>

      <section className="section home-showcase">
        <div className="showcase-copy">
          <p className="eyebrow">Como se usa</p>
          <h2>Una plataforma clara para DJs, particulares y fiestas privadas</h2>
          <p className="muted">
            No hace falta complicarlo: perfiles, ofertas, candidaturas y mensajes.
            Es justo lo que necesita una primera version completa para el TFG.
          </p>
        </div>
        <div className="role-grid">
          <article className="role-card">
            <span>DJ</span>
            <h3>Soy DJ</h3>
            <p>Creo mi perfil, indico ciudad, experiencia y precio, y me apunto a ofertas.</p>
            <Link className="text-link" to="/panel-dj">
              Ir al panel DJ
            </Link>
          </article>
          <article className="role-card">
            <span>Evento</span>
            <h3>Busco DJ</h3>
            <p>Publico un evento, reviso candidaturas y contacto con DJs desde mensajes.</p>
            <Link className="text-link" to="/panel-organizador">
              Ir al panel particular
            </Link>
          </article>
          <article className="role-card private-role">
            <span>Sala</span>
            <h3>Fiesta privada</h3>
            <p>Una sala, discoteca o empresa publica eventos y habla solo con DJs.</p>
            <Link className="text-link" to="/panel-fiesta-privada">
              Ir al panel fiesta privada
            </Link>
          </article>
        </div>
      </section>

      <section className="section event-strip">
        <article>
          <span>Casa</span>
          <strong>Fiestas privadas</strong>
          <p>Cumpleanos, bodas, comuniones o celebraciones familiares.</p>
        </article>
        <article>
          <span>Empresa</span>
          <strong>Empresas</strong>
          <p>Eventos corporativos, cenas, inauguraciones y promociones.</p>
        </article>
        <article>
          <span>Sala</span>
          <strong>Locales y salas</strong>
          <p>Sesiones de noche, eventos tematicos y fiestas de fin de semana.</p>
        </article>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>DJs destacados</h2>
          <Link className="text-link" to="/buscar-djs">
            Ver todos
          </Link>
        </div>
        <div className="card-grid">
          {loading && <p className="muted">Cargando DJs destacados...</p>}
          {!loading &&
            featuredDjs.map((dj) => <DjCard dj={dj} key={dj.id} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Ofertas recientes</h2>
          <Link className="text-link" to="/ofertas">
            Ver ofertas
          </Link>
        </div>
        <div className="mini-offer-grid">
          {recentOffers.map((offer) => (
            <article className="mini-offer-card" key={offer.id}>
              <img
                className="mini-offer-image"
                src={offer.imageUrl || heroImage}
                alt={offer.title}
              />
              <h3>{offer.title}</h3>
              <p className="muted">
                {offer.city} - {offer.eventDate || 'Fecha sin definir'}
              </p>
            </article>
          ))}
          {!loading && recentOffers.length === 0 && (
            <div className="empty-state">
              <strong>Todavia no hay ofertas publicadas</strong>
              <p>Cuando un particular o fiesta privada publique una oferta, aparecera aqui.</p>
              <Link className="button secondary" to="/registro">
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage
