import React, { useEffect, useState } from 'react'
import TasksTable from './components/TasksTable'
import Login from './components/Login'

export default function App() {
  const [authToken, setAuthToken] = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [saving, setSaving] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('authUser')

    if (token && user) {
      // Verify token is still valid
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session expired')
          return res.json()
        })
        .then(() => {
          setAuthToken(token)
          setAuthUser(JSON.parse(user))
        })
        .catch(() => {
          localStorage.removeItem('authToken')
          localStorage.removeItem('authUser')
        })
    }
  }, [])

  function handleLogin(token, user) {
    setAuthToken(token)
    setAuthUser(user)
  }

  function handleLogout() {
    if (authToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      }).catch(console.error)
    }

    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setAuthToken(null)
    setAuthUser(null)
    setTasks([])
    setLoading(true)
  }

  // Fetch tasks when authenticated
  useEffect(() => {
    if (!authToken) {
      setLoading(true)
      return
    }

    let cancelled = false
    fetch('/api/tasks')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => (cancelled = true)
  }, [authToken])

  function handleToggleCompleted(id, completed) {
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((updated) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      })
      .catch((err) => setError(err.message))
  }

  function handleCreateTask(e) {
    e.preventDefault()
    if (!newTitle.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim(), dueDate: newDueDate || null })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((created) => {
        setTasks((prev) => [...prev, created])
        setNewTitle('')
        setNewDueDate('')
      })
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false))
  }

  // Show login page if not authenticated
  if (!authToken) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <header>
        <h1>Tasks</h1>
        <div className="user-info">
          <span>Welcome, {authUser?.username}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main>
        {loading && <p>Loading tasks…</p>}
        {error && <p className="error">Error: {error}</p>}

        {/* new task form */}
        <form className="new-task-form" onSubmit={handleCreateTask}>
          <input
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            aria-label="New task title"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            aria-label="New task due date"
          />
          <button type="submit" disabled={saving}>
            Add Task
          </button>
        </form>

        {!loading && !error && (
          <TasksTable tasks={tasks} onToggleCompleted={handleToggleCompleted} />
        )}
      </main>
    </div>
  )
}
