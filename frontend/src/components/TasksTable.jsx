import React from 'react'

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString()
}

function daysRemaining(iso) {
  if (!iso) return null
  const now = new Date()
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const msPerDay = 1000 * 60 * 60 * 24
  // round up partial days
  return Math.ceil((d.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / msPerDay)
}

function renderAsciiBar(iso, options = {}) {
  const days = daysRemaining(iso)
  const barLength = options.barLength || 20
  const maxDays = options.maxDays || barLength

  const capped = Math.max(0, Math.min(days === null ? 0 : days, maxDays))
  const filled = Math.round((capped / maxDays) * barLength)
  const empty = barLength - filled
  const fillChar = options.fillChar || '='
  const emptyChar = options.emptyChar || '-'
  const bar = `[${fillChar.repeat(filled)}${emptyChar.repeat(empty)}]`
  const label = days === null ? 'n/a' : (days < 0 ? `overdue ${Math.abs(days)}d` : `${days}d`) 
  return (
    <code className="ascii-bar" title={`${label} remaining`}>
      {bar} {label}
    </code>
  )
}

export default function TasksTable({ tasks }) {
  if (!Array.isArray(tasks) || tasks.length === 0) return <p>No tasks found.</p>

  return (
    <table className="tasks-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Completed</th>
          <th>Due Date</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.title}</td>
            <td>{t.completed ? 'Yes' : 'No'}</td>
            <td>{formatDate(t.dueDate)}</td>
            <td>{renderAsciiBar(t.dueDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
