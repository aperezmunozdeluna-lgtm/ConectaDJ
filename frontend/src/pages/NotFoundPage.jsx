import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="form-page">
      <section className="form-box">
        <h1>Pagina no encontrada</h1>
        <p className="muted">La ruta que has abierto no existe.</p>
        <Link className="button primary" to="/">
          Volver al inicio
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage

