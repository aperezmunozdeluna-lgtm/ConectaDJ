import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { clearSession, getSession } from '../services/session'

function MainLayout() {
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    function updateSession() {
      setSession(getSession())
    }

    window.addEventListener('storage', updateSession)
    window.addEventListener('sessionChanged', updateSession)

    return () => {
      window.removeEventListener('storage', updateSession)
      window.removeEventListener('sessionChanged', updateSession)
    }
  }, [])

  function logout() {
    clearSession()
  }

  function getPanelLink() {
    if (session?.role === 'admin') {
      return <NavLink to="/panel-admin">Panel administrador</NavLink>
    }

    if (session?.role === 'organizer') {
      return <NavLink to="/panel-organizador">Panel particular</NavLink>
    }

    if (session?.role === 'private_party') {
      return <NavLink to="/panel-fiesta-privada">Panel fiesta privada</NavLink>
    }

    return <NavLink to="/panel-dj">Panel DJ</NavLink>
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          ConectaDJ
        </Link>
        <nav className="main-nav" aria-label="Navegacion principal">
          <NavLink to="/buscar-djs">Buscar DJs</NavLink>
          <NavLink to="/ofertas">Ofertas</NavLink>
          <NavLink to="/mensajes">Mensajes</NavLink>
          {getPanelLink()}
        </nav>
        <div className="header-actions">
          {session ? (
            <>
              <span className="session-name">{session.displayName}</span>
              <button className="button secondary" type="button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link className="button secondary" to="/login">
                Entrar
              </Link>
              <Link className="button primary" to="/registro">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  )
}

export default MainLayout
