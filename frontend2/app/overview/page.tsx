'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://172.31.180.111:8000/users/')
        setUsers(response.data)
      } catch (err) {
        setError('Fehler beim Laden der Benutzerliste.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Benutzerliste</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p className="text-center text-gray-500">Laden...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Benutzername</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: { username: string }, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}