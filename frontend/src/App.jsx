import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DjSearchPage from './pages/DjSearchPage'
import DjProfilePage from './pages/DjProfilePage'
import OffersPage from './pages/OffersPage'
import OfferDetailPage from './pages/OfferDetailPage'
import MessagesPage from './pages/MessagesPage'
import DjDashboardPage from './pages/DjDashboardPage'
import OrganizerDashboardPage from './pages/OrganizerDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="buscar-djs" element={<DjSearchPage />} />
        <Route path="djs/:id" element={<DjProfilePage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="ofertas/:id" element={<OfferDetailPage />} />
        <Route path="mensajes" element={<MessagesPage />} />
        <Route path="panel-dj" element={<DjDashboardPage />} />
        <Route path="panel-organizador" element={<OrganizerDashboardPage />} />
        <Route path="panel-fiesta-privada" element={<OrganizerDashboardPage />} />
        <Route path="panel-admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
