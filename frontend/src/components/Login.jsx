import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required')
      setLoading(false)
      return
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid credentials')
        return res.json()
      })
      .then((data) => {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('authUser', JSON.stringify(data.user))
        onLogin(data.token, data.user)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            aria-label="Username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            aria-label="Password"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="hint">Demo: admin / admin234</p>
      </div>
    </div>
  )
}
