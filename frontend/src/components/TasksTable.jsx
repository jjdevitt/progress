import React from 'react'

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString()
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
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.title}</td>
            <td>{t.completed ? 'Yes' : 'No'}</td>
            <td>{formatDate(t.dueDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
