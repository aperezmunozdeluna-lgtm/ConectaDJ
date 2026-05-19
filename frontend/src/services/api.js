import { getSession } from './session'

const API_URL = 'http://localhost:8080/api'
const SERVER_CONNECTION_ERROR =
  'No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.'

export function obtenerMensajeError(error, fallbackMessage = SERVER_CONNECTION_ERROR) {
  if (!error?.message || error.message === 'Failed to fetch') {
    return fallbackMessage
  }

  return error.message
}

function getCabecerasAdministrador() {
  const session = getSession()

  return {
    'X-User-Email': session?.email || '',
  }
}

export async function registrarUsuario(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo registrar el usuario')
  }

  return response.json()
}

export async function iniciarSesion(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo iniciar sesion')
  }

  return response.json()
}

export async function listarDjs(filters = {}) {
  const params = new URLSearchParams()

  if (filters.city) {
    params.append('city', filters.city)
  }

  if (filters.minExperience && filters.minExperience !== '0') {
    params.append('minExperience', filters.minExperience)
  }

  if (filters.available) {
    params.append('available', 'true')
  }

  if (filters.styleSlug) {
    params.append('styleSlug', filters.styleSlug)
  }

  const query = params.toString()
  const url = query ? `${API_URL}/djs?${query}` : `${API_URL}/djs`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los DJs')
  }

  return response.json()
}

export async function obtenerDjPorId(id) {
  const response = await fetch(`${API_URL}/djs/${id}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el perfil del DJ')
  }

  return response.json()
}

export async function actualizarDjProfile(id, profile) {
  const response = await fetch(`${API_URL}/djs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar el perfil del DJ')
  }

  return response.json()
}

export async function listarOfertas(filters = {}) {
  const params = new URLSearchParams()

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.city) {
    params.append('city', filters.city)
  }

  if (filters.minBudget) {
    params.append('minBudget', filters.minBudget)
  }

  if (filters.maxExperience && filters.maxExperience !== '0') {
    params.append('maxExperience', filters.maxExperience)
  }

  if (filters.musicStyleId && filters.musicStyleId !== '0') {
    params.append('musicStyleId', filters.musicStyleId)
  }

  const query = params.toString()
  const url = query ? `${API_URL}/offers?${query}` : `${API_URL}/offers`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las ofertas')
  }

  return response.json()
}

export async function obtenerOfertaPorId(id) {
  const response = await fetch(`${API_URL}/offers/${id}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar la oferta')
  }

  return response.json()
}

export async function inscribirseOferta(jobOfferId, djProfileId, message = 'Me interesa esta oferta.') {
  const response = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobOfferId,
      djProfileId,
      message,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo crear la candidatura')
  }

  return response.json()
}

export async function listarCandidaturasDj(djProfileId) {
  const response = await fetch(`${API_URL}/applications/dj/${djProfileId}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las candidaturas')
  }

  return response.json()
}

export async function obtenerOrganizadorPorId(id) {
  const response = await fetch(`${API_URL}/organizers/${id}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el organizador')
  }

  return response.json()
}

export async function actualizarOrganizador(id, profile) {
  const response = await fetch(`${API_URL}/organizers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error('No se pudo actualizar el perfil del organizador')
  }

  return response.json()
}

export async function listarOfertasOrganizador(organizerId) {
  const response = await fetch(`${API_URL}/offers/organizer/${organizerId}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las ofertas del organizador')
  }

  return response.json()
}

export async function listarCandidaturasOrganizador(organizerId) {
  const response = await fetch(`${API_URL}/applications/organizer/${organizerId}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las candidaturas recibidas')
  }

  return response.json()
}

export async function crearOferta(offer) {
  const response = await fetch(`${API_URL}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offer),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo crear la oferta')
  }

  return response.json()
}

export async function actualizarOferta(offerId, offer) {
  const response = await fetch(`${API_URL}/offers/${offerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offer),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo actualizar la oferta')
  }

  return response.json()
}

export async function actualizarEstadoOferta(offerId, status) {
  const response = await fetch(`${API_URL}/offers/${offerId}/status?status=${status}`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo cambiar el estado de la oferta')
  }

  return response.json()
}

export async function actualizarEstadoCandidatura(applicationId, status) {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/status?status=${status}`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo actualizar la candidatura')
  }

  return response.json()
}

export async function subirImagen(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/uploads/images`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo subir la imagen')
  }

  return response.json()
}

export async function listarEstilosMusicales() {
  const response = await fetch(`${API_URL}/music-styles`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los estilos musicales')
  }

  return response.json()
}

export async function listarUsuarios() {
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los usuarios')
  }

  return response.json()
}

export async function listarConversacionesUsuario(userId) {
  const response = await fetch(`${API_URL}/conversations/user/${userId}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las conversaciones')
  }

  return response.json()
}

export async function contarMensajesNoLeidos(userId) {
  const response = await fetch(`${API_URL}/conversations/user/${userId}/unread`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los mensajes no leidos')
  }

  return response.json()
}

export async function marcarConversacionLeida(conversationId, userId) {
  const response = await fetch(`${API_URL}/conversations/${conversationId}/read?userId=${userId}`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error('No se pudo marcar la conversacion como leida')
  }
}

export async function crearConversacion(conversation) {
  const response = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(conversation),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear la conversacion')
  }

  return response.json()
}

export async function listarMensajes(conversationId) {
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los mensajes')
  }

  return response.json()
}

export async function enviarMensaje(message) {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error('No se pudo enviar el mensaje')
  }

  return response.json()
}

export async function listarOpinionesDj(djProfileId) {
  const response = await fetch(`${API_URL}/djs/${djProfileId}/reviews`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las opiniones')
  }

  return response.json()
}

export async function crearOpinion(opinion) {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opinion),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo guardar la opinion')
  }

  return response.json()
}

export async function listarDjsFavoritos(organizerId) {
  const response = await fetch(`${API_URL}/favorites/organizer/${organizerId}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los DJs guardados')
  }

  return response.json()
}

export async function guardarDjFavorito(organizerId, djProfileId) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizerId,
      djProfileId,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo guardar el DJ')
  }

  return response.json()
}

export async function eliminarDjFavorito(organizerId, djProfileId) {
  const response = await fetch(`${API_URL}/favorites/organizer/${organizerId}/dj/${djProfileId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('No se pudo quitar el DJ guardado')
  }
}

export async function obtenerResumenAdmin() {
  const response = await fetch(`${API_URL}/admin/summary`, {
    headers: getCabecerasAdministrador(),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo cargar el resumen de administracion')
  }

  return response.json()
}

export async function listarUsuariosAdmin() {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: getCabecerasAdministrador(),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudieron cargar los usuarios de administracion')
  }

  return response.json()
}

export async function listarOfertasAdmin() {
  const response = await fetch(`${API_URL}/admin/offers`, {
    headers: getCabecerasAdministrador(),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudieron cargar las ofertas de administracion')
  }

  return response.json()
}

export async function actualizarUsuarioActivo(userId, active) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/active?active=${active}`, {
    method: 'PATCH',
    headers: getCabecerasAdministrador(),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo actualizar el usuario')
  }

  return response.json()
}

export async function actualizarEstadoOfertaAdmin(offerId, status) {
  const response = await fetch(`${API_URL}/admin/offers/${offerId}/status?status=${status}`, {
    method: 'PATCH',
    headers: getCabecerasAdministrador(),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || 'No se pudo actualizar la oferta')
  }

  return response.json()
}
