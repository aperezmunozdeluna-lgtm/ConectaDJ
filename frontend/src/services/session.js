const SESSION_KEY = 'conectadj_session'

export function getSession() {
  const savedSession = localStorage.getItem(SESSION_KEY)
  return savedSession ? JSON.parse(savedSession) : null
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('sessionChanged'))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('sessionChanged'))
}
