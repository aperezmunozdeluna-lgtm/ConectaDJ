import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  contarMensajesNoLeidos,
  crearConversacion,
  enviarMensaje,
  listarConversacionesUsuario,
  listarMensajes,
  listarUsuarios,
  marcarConversacionLeida,
  obtenerMensajeError,
} from '../services/api'
import { getSession } from '../services/session'

function MessagesPage() {
  const [searchParams] = useSearchParams()
  const [session, setSession] = useState(getSession())
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [conversationSearch, setConversationSearch] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [unreadCounts, setUnreadCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const [directConversationStarted, setDirectConversationStarted] = useState(false)
  const directUserId = Number(searchParams.get('userId') || 0)

  useEffect(() => {
    const currentSession = getSession()
    setSession(currentSession)

    if (!currentSession) {
      setLoading(false)
      setError('Inicia sesion para usar la mensajeria')
      return
    }

    loadMessagingData(currentSession)
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function loadMessagingData(currentSession = session) {
    if (!currentSession) {
      return Promise.resolve()
    }

    return Promise.all([
      listarUsuarios(),
      listarConversacionesUsuario(currentSession.userId),
      contarMensajesNoLeidos(currentSession.userId),
    ]).then(([usersData, conversationsData, unreadData]) => {
      setUsers(usersData)
      setConversations(conversationsData)
      setUnreadCounts(unreadData)
      setError('')
    })
  }

  useEffect(() => {
    if (!directUserId || directConversationStarted || !session || users.length === 0) {
      return
    }

    const selectedUser = users.find((user) => user.userId === directUserId)

    if (!selectedUser || selectedUser.userId === session.userId) {
      return
    }

    setDirectConversationStarted(true)
    startConversation(selectedUser)
  }, [directUserId, directConversationStarted, session, users])

  function getRoleLabel(role) {
    if (role === 'dj') {
      return 'DJ'
    }

    if (role === 'private_party') {
      return 'Fiesta privada'
    }

    return 'Particular o sala'
  }

  function canStartConversation(user) {
    if (!session || user.userId === session.userId) {
      return false
    }

    const currentIsPrivateParty = session.role === 'private_party'
    const otherIsPrivateParty = user.role === 'private_party'

    if (!currentIsPrivateParty && !otherIsPrivateParty) {
      return true
    }

    return (currentIsPrivateParty && user.role === 'dj')
      || (otherIsPrivateParty && session.role === 'dj')
  }

  function getUserInitial(user) {
    return user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
  }

  function formatMessageDate(value) {
    if (!value) {
      return ''
    }

    return new Date(value).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatConversationDate(value) {
    if (!value) {
      return 'Sin mensajes'
    }

    return new Date(value).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function normalizeText(value) {
    return value?.toString().toLowerCase().trim() || ''
  }

  function getTotalUnread() {
    return Object.values(unreadCounts).reduce((total, value) => total + Number(value || 0), 0)
  }

  function getOtherUser(conversation) {
    if (!session) {
      return null
    }

    const otherUserId =
      conversation.userOneId === session.userId
        ? conversation.userTwoId
        : conversation.userOneId

    return users.find((user) => user.userId === otherUserId) || {
      userId: otherUserId,
      displayName: `Usuario ${otherUserId}`,
      role: 'organizer',
    }
  }

  function openConversation(conversation) {
    setActiveConversation(conversation)
    setLoadingMessages(true)
    setError('')

    listarMensajes(conversation.id)
      .then((messagesData) => {
        setMessages(messagesData)
        if (session?.userId) {
          return marcarConversacionLeida(conversation.id, session.userId)
        }

        return null
      })
      .then(() => {
        if (session?.userId) {
          return contarMensajesNoLeidos(session.userId)
        }

        return null
      })
      .then((unreadData) => {
        if (unreadData) {
          setUnreadCounts(unreadData)
        }
      })
      .catch(() => {
        setError('No se ha podido conectar con el servidor. Comprueba que Spring Boot esta iniciado.')
      })
      .finally(() => {
        setLoadingMessages(false)
      })
  }

  function startConversation(user) {
    if (!session) {
      setError('Inicia sesion para abrir una conversacion')
      return
    }

    if (!canStartConversation(user)) {
      setError('Las fiestas privadas solo pueden hablar con DJs')
      return
    }

    crearConversacion({
      userOneId: session.userId,
      userTwoId: user.userId,
    })
      .then((conversationData) => {
        setConversations((currentConversations) => {
          const exists = currentConversations.some(
            (conversation) => conversation.id === conversationData.id,
          )

          if (exists) {
            return currentConversations
          }

          return [conversationData, ...currentConversations]
        })
        setContactSearch('')
        openConversation(conversationData)
      })
      .catch((requestError) => {
        setError(obtenerMensajeError(requestError))
      })
  }

  function handleSendMessage(event) {
    event.preventDefault()

    if (!activeConversation || !session) {
      setError('Selecciona una conversacion antes de enviar un mensaje.')
      return
    }

    if (!newMessage.trim()) {
      setError('Escribe un mensaje antes de enviarlo.')
      return
    }

    enviarMensaje({
      conversationId: activeConversation.id,
      senderUserId: session.userId,
      body: newMessage.trim(),
    })
      .then(() => {
        setNewMessage('')
        return Promise.all([
          listarMensajes(activeConversation.id),
          listarConversacionesUsuario(session.userId),
          contarMensajesNoLeidos(session.userId),
        ])
      })
      .then(([messagesData, conversationsData, unreadData]) => {
        setMessages(messagesData)
        setConversations(conversationsData)
        setUnreadCounts(unreadData)
        setError('')
      })
      .catch(() => {
        setError('No se ha podido enviar el mensaje. Comprueba que Spring Boot esta iniciado.')
      })
  }

  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = getOtherUser(conversation)
    const search = normalizeText(conversationSearch)

    if (!search) {
      return true
    }

    return normalizeText(otherUser?.displayName).includes(search)
      || normalizeText(getRoleLabel(otherUser?.role)).includes(search)
  })

  const availableUsers = users
    .filter(canStartConversation)
    .filter((user) => {
      const search = normalizeText(contactSearch)

      if (!search) {
        return true
      }

      return normalizeText(user.displayName).includes(search)
        || normalizeText(user.email).includes(search)
        || normalizeText(getRoleLabel(user.role)).includes(search)
    })
  const activeUser = activeConversation ? getOtherUser(activeConversation) : null

  return (
    <main className="section">
      <div className="section-title">
        <div>
          <p className="eyebrow">Mensajeria</p>
          <h1>Mensajes</h1>
          <p className="muted">
            Habla con usuarios permitidos segun tu tipo de cuenta. Las fiestas privadas solo pueden hablar con DJs.
          </p>
        </div>
        {session && (
          <div className="message-summary">
            <span>{conversations.length}</span>
            <small>conversaciones</small>
            <span>{getTotalUnread()}</span>
            <small>sin leer</small>
          </div>
        )}
      </div>
      {loading && <p className="muted">Cargando mensajes...</p>}
      {error && <p className="muted">{error}</p>}
      <section className="messages-layout">
        <aside className="conversation-list">
          <div className="message-list-header">
            <h2>Conversaciones</h2>
            <button className="button secondary" type="button" onClick={() => loadMessagingData()}>
              Actualizar
            </button>
          </div>
          <input
            className="message-search"
            type="search"
            placeholder="Buscar conversacion"
            value={conversationSearch}
            onChange={(event) => setConversationSearch(event.target.value)}
          />
          {conversations.length === 0 && (
            <div className="empty-state small-empty">
              <strong>Sin conversaciones</strong>
              <p>Busca un usuario en "Nuevo mensaje" o entra en un perfil de DJ para empezar.</p>
            </div>
          )}
          {conversations.length > 0 && filteredConversations.length === 0 && (
            <p className="muted">No hay conversaciones con ese filtro.</p>
          )}
          {filteredConversations.map((conversation) => {
            const otherUser = getOtherUser(conversation)
            const unreadCount = Number(unreadCounts[conversation.id] || 0)

            return (
              <button
                className={[
                  activeConversation?.id === conversation.id ? 'active' : '',
                  unreadCount > 0 ? 'unread' : '',
                ].join(' ')}
                key={conversation.id}
                type="button"
                onClick={() => openConversation(conversation)}
              >
                {otherUser?.photoUrl ? (
                  <img src={otherUser.photoUrl} alt={otherUser.displayName} />
                ) : (
                  <strong>{getUserInitial(otherUser)}</strong>
                )}
                <span>{otherUser?.displayName}</span>
                <small>
                  {getRoleLabel(otherUser?.role)} - {formatConversationDate(conversation.lastMessageAt)}
                </small>
                {unreadCount > 0 && <em>{unreadCount}</em>}
              </button>
            )
          })}

          <div className="user-list">
            <h2>Nuevo mensaje</h2>
            <input
              className="message-search"
              type="search"
              placeholder="Buscar usuario"
              value={contactSearch}
              onChange={(event) => setContactSearch(event.target.value)}
            />
            {availableUsers.length === 0 && (
              <div className="empty-state small-empty">
                <strong>No hay contactos</strong>
                <p>Prueba con otro nombre o revisa que haya mas usuarios registrados.</p>
              </div>
            )}
            {availableUsers.map((user) => (
              <button key={user.userId} type="button" onClick={() => startConversation(user)}>
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.displayName} />
                ) : (
                  <strong>{getUserInitial(user)}</strong>
                )}
                <span>{user.displayName}</span>
                <small>{getRoleLabel(user.role)}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="conversation">
          <div className="message-panel-header">
            <div>
              <h2>{activeUser?.displayName || 'Selecciona una conversacion'}</h2>
              <p className="muted">
                {activeUser
                  ? `${getRoleLabel(activeUser.role)} conectado a ConectaDJ`
                  : 'Elige una conversacion o empieza una nueva.'}
              </p>
              {activeConversation?.jobOfferId && (
                <Link className="text-link" to={`/ofertas/${activeConversation.jobOfferId}`}>
                  Ver oferta relacionada
                </Link>
              )}
            </div>
            {activeUser && (
              <div className="message-user-card">
                {activeUser.photoUrl ? (
                  <img src={activeUser.photoUrl} alt={activeUser.displayName} />
                ) : (
                  <strong>{getUserInitial(activeUser)}</strong>
                )}
                <span>{getRoleLabel(activeUser.role)}</span>
              </div>
            )}
          </div>

          <div className="message-stream">
            {loadingMessages && <p className="muted">Cargando conversacion...</p>}
            {!loadingMessages && activeConversation && messages.length === 0 && (
              <div className="message-empty empty-state small-empty">
                <strong>Todavia no hay mensajes</strong>
                <p>Escribe el primer mensaje para iniciar la conversacion.</p>
              </div>
            )}
            {!activeConversation && (
              <div className="message-empty empty-state small-empty">
                <strong>Selecciona una conversacion</strong>
                <p>Elige una conversacion o busca un usuario para empezar a hablar.</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                className={
                  message.senderUserId === session?.userId ? 'message sent' : 'message received'
                }
                key={message.id}
              >
                <span>{message.body}</span>
                <small>{formatMessageDate(message.sentAt)}</small>
              </div>
            ))}
          </div>

          <form className="message-box" onSubmit={handleSendMessage}>
            <input
              type="text"
              disabled={!activeConversation}
              placeholder={activeConversation ? 'Escribe un mensaje' : 'Selecciona una conversacion'}
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
            />
            <button className="button primary" type="submit" disabled={!activeConversation}>
              Enviar
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default MessagesPage
