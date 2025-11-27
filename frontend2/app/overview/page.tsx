'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Leaderboards() {
  const [pongLeaderboard, setPongLeaderboard] = useState([])
  const [snakeLeaderboard, setSnakeLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('') // State for search term

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const [pongResponse, snakeResponse] = await Promise.all([
          axios.get('http://172.31.180.111:8000/users/leaderboard/pong'),
          axios.get('http://172.31.180.111:8000/users/leaderboard/snake'),
        ])
        setPongLeaderboard(pongResponse.data)
        setSnakeLeaderboard(snakeResponse.data)
      } catch (err) {
        setError('Fehler beim Laden der Bestenlisten.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboards()
  }, [])

  // Filtered leaderboards based on the search term
  const filteredPongLeaderboard = pongLeaderboard.filter((user: { username: string }) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredSnakeLeaderboard = snakeLeaderboard.filter((user: { username: string }) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Bestenlisten</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Benutzername suchen</h3>
          <input
            type="text"
            placeholder="Benutzername suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <p className="text-center text-gray-500">Laden...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="flex flex-wrap gap-8">
            <section className="flex-1 min-w-[300px]">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pong Leaderboard</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">Benutzername</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPongLeaderboard.map((user: { username: string; pong_high_score: number }, index: number) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 ${
                        index === 0
                          ? 'bg-yellow-100 font-bold' // Gold for 1st place
                          : index === 1
                          ? 'bg-gray-200 font-semibold' // Silver for 2nd place
                          : index === 2
                          ? 'bg-orange-200 font-medium' // Bronze for 3rd place
                          : ''
                      }`}
                    >
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{user.username}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{user.pong_high_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="flex-1 min-w-[300px]">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Snake Leaderboard</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">Benutzername</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-500">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPongLeaderboard.map((user: { username: string; pong_high_score: number }, index: number) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 ${
                        index === 0
                          ? 'bg-yellow-100 font-bold' // Gold for 1st place
                          : index === 1
                          ? 'bg-gray-200 font-semibold' // Silver for 2nd place
                          : index === 2
                          ? 'bg-orange-200 font-medium' // Bronze for 3rd place
                          : ''
                      }`}
                    >
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{user.username}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-700">{user.pong_high_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}