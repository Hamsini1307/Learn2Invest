const API_BASE = '' // Handled by Vite proxy during dev (proxying to http://localhost:5000)

export async function apiRequest(endpoint, method = 'GET', body = null, timeoutMs = 8000) {
  const token = localStorage.getItem('l2i_token')
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Request failed with status ${res.status}`)
    }

    return await res.json()
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      throw new Error('Server request timed out. Please try again.')
    }
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to backend server. Please check connection.')
    }
    throw err
  }
}

