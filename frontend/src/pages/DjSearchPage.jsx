import { useEffect, useState } from 'react'
import DjCard from '../components/DjCard'
import { listarDjs, listarEstilosMusicales } from '../services/api'

function DjSearchPage() {
  const [djs, setDjs] = useState([])
  const [musicStyles, setMusicStyles] = useState([])
  const [filters, setFilters] = useState({
    city: '',
    styleSlug: '',
    minExperience: '0',
    available: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([listarDjs(filters), listarEstilosMusicales()])
      .then(([djsData, stylesData]) => {
        setDjs(djsData)
        setMusicStyles(stylesData)
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
    const { name, value, type, checked } = event.target

    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  function clearFilters() {
    setFilters({
      city: '',
      styleSlug: '',
      minExperience: '0',
      available: false,
    })
  }

  return (
    <main className="section">
      <section className="search-hero">
        <div>
          <p className="eyebrow">Buscador</p>
          <h1>Buscar DJs</h1>
          <p>
            Filtra por ciudad, experiencia y disponibilidad para encontrar un DJ
            que encaje con una fiesta privada, sala o evento.
          </p>
        </div>
        <div className="search-hero-counter">
          <strong>{djs.length}</strong>
          <span>DJs encontrados</span>
        </div>
      </section>

      <div className="search-layout">
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
              name="styleSlug"
              value={filters.styleSlug}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              {musicStyles.map((style) => (
                <option key={style.id} value={style.slug}>
                  {style.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Experiencia minima
            <select
              name="minExperience"
              value={filters.minExperience}
              onChange={handleFilterChange}
            >
              <option value="0">Sin requisito</option>
              <option value="1">+1 anio</option>
              <option value="3">+3 anios</option>
              <option value="5">+5 anios</option>
            </select>
          </label>
          <label className="checkbox-label">
            <input
              name="available"
              type="checkbox"
              checked={filters.available}
              onChange={handleFilterChange}
            />
            Solo disponibles
          </label>
          <button className="button secondary" type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </aside>

        <section className="results">
          <div className="results-toolbar">
            <div>
              <h2>Resultados</h2>
              <p className="muted">
                {filters.city || filters.styleSlug || filters.available || filters.minExperience !== '0'
                  ? 'Filtros aplicados al listado de DJs.'
                  : 'Listado general de DJs registrados.'}
              </p>
            </div>
          </div>
          {loading && <p className="muted">Cargando DJs...</p>}
          {error && <p className="muted">{error}</p>}
          {!loading && !error && djs.length === 0 && (
            <div className="empty-state">
              <strong>No hay DJs con esos filtros</strong>
              <p>Prueba con otra ciudad, otro estilo musical o quitando el filtro de disponibilidad.</p>
              <button className="button secondary" type="button" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}
          {!loading &&
            !error &&
            djs.map((dj) => <DjCard dj={dj} key={dj.id} />)}
        </section>
      </div>
    </main>
  )
}

export default DjSearchPage
