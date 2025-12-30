import React, { useEffect, useState } from 'react'
import TasksTable from './components/TasksTable'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
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
  }, [])

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

  return (
    <div className="app-container">
      <header>
        <h1>Tasks</h1>
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
