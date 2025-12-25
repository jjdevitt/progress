import React, { useEffect, useState } from 'react'
import TasksTable from './components/TasksTable'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="app-container">
      <header>
        <h1>Tasks</h1>
      </header>
      <main>
        {loading && <p>Loading tasks…</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && <TasksTable tasks={tasks} />}
      </main>
    </div>
  )
}
