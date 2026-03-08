// ── Annadata AI — API Service ─────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Token management
const getToken = () => localStorage.getItem('annadata_token')
const setToken = (token) => localStorage.setItem('annadata_token', token)
const removeToken = () => localStorage.removeItem('annadata_token')

// Base fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

// ── Auth API ───────────────────────────────────────────────
export const authAPI = {
  firebaseLogin: (idToken) =>
    apiFetch('/auth/firebase-login', { method: 'POST', body: JSON.stringify({ idToken }) }),

  getMe: () => apiFetch('/auth/me'),

  updateProfile: (data) =>
    apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
}

// ── Crops API ──────────────────────────────────────────────
export const cropsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/crops${query ? `?${query}` : ''}`)
  },
  getById: (id) => apiFetch(`/crops/${id}`),
}

// ── Community API ──────────────────────────────────────────
export const communityAPI = {
  getThreads: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/community/threads${query ? `?${query}` : ''}`)
  },
  getThread: (id) => apiFetch(`/community/threads/${id}`),
  createThread: (data) =>
    apiFetch('/community/threads', { method: 'POST', body: JSON.stringify(data) }),
  voteThread: (id, direction) =>
    apiFetch(`/community/threads/${id}/vote`, { method: 'POST', body: JSON.stringify({ direction }) }),
  postAnswer: (threadId, data) =>
    apiFetch(`/community/threads/${threadId}/answers`, { method: 'POST', body: JSON.stringify(data) }),
  voteAnswer: (id, direction) =>
    apiFetch(`/community/answers/${id}/vote`, { method: 'POST', body: JSON.stringify({ direction }) }),
}

// ── Mandi Rates API ────────────────────────────────────────
export const mandiAPI = {
  getRates: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/mandi-rates${query ? `?${query}` : ''}`)
  },
  getById: (id) => apiFetch(`/mandi-rates/${id}`),
}

// ── Transport API ──────────────────────────────────────────
export const transportAPI = {
  getProviders: () => apiFetch('/transport/providers'),
  createRequest: (data) =>
    apiFetch('/transport/requests', { method: 'POST', body: JSON.stringify(data) }),
  getMyRequests: () => apiFetch('/transport/requests'),
  getRequest: (id) => apiFetch(`/transport/requests/${id}`),
}

// ── AI Chat API ────────────────────────────────────────────
export const aiAPI = {
  chat: (message, sessionId, imageBase64) =>
    apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ message, sessionId, imageBase64 }) }),
  getHistory: (sessionId) =>
    apiFetch(`/ai/history?sessionId=${sessionId}`),
}

// Token helpers export
export { getToken, setToken, removeToken }
