'use client'

import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

export default function Leaderboards() {
  const [pongLeaderboard, setPongLeaderboard] = useState<any[]>([])
  const [snakeLeaderboard, setSnakeLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')

  const fetchLeaderboards = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pongResponse, snakeResponse] = await Promise.all([
        axios.get('http://172.31.180.145:8000/users/leaderboard/pong'),
        axios.get('http://172.31.180.145:8000/users/leaderboard/snake'),
      ])
      setPongLeaderboard(pongResponse.data)
      setSnakeLeaderboard(snakeResponse.data)
    } catch (err) {
      setError('Fehler beim Laden des Leaderboards.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  // 🔹 Filtered leaderboards
  const filteredSnake = useMemo(() => {
    return snakeLeaderboard.filter((u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, snakeLeaderboard])

  const filteredPong = useMemo(() => {
    return pongLeaderboard.filter((u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, pongLeaderboard])

  // 🔹 Ranking maps
  const snakeRanks = useMemo(() => {
    const map: Record<string, number> = {}
    snakeLeaderboard.forEach((user, index) => (map[user.username] = index + 1))
    return map
  }, [snakeLeaderboard])

  const pongRanks = useMemo(() => {
    const map: Record<string, number> = {}
    pongLeaderboard.forEach((user, index) => (map[user.username] = index + 1))
    return map
  }, [pongLeaderboard])

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-blue-900/60 text-blue-300 font-bold"
      case 2:
        return "bg-purple-900/60 text-purple-300 font-bold"
      case 3:
        return "bg-pink-900/60 text-pink-300 font-bold"
      default:
        return "hover:bg-blue-900/40 transition"
    }
  }

  // 🔹 Create user + auto refresh
  const handleCreateUser = async () => {
    try {
      await axios.post('http://172.31.180.145:8000/users/', { username: newUsername })
      setIsModalOpen(false)
      setNewUsername('')
      alert('Benutzer erfolgreich erstellt!')

      // 🔄 Refresh leaderboards automatically
      fetchLeaderboards()
    } catch (err) {
      alert('Fehler beim Erstellen des Benutzers.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black text-neon font-arcade">

      {/* HEADER */}
      <header className="border-b border-blue-500/40 shadow-[0_0_15px_#00f] bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_10px_#1e90ff] flex items-center gap-3">
              🎮 Arcade Leaderboards
            </h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md 
              shadow-[0_0_15px_#1e90ff] hover:shadow-[0_0_25px_#1e90ff] transition"
            >
              + Neuer Benutzer
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* SEARCH */}
        <div className="mb-8">
          <h3 className="font-medium text-blue-300 mb-2">🔍 Benutzername suchen</h3>
          <input
            type="text"
            placeholder="Benutzername..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md px-4 py-2 border border-blue-500 bg-black text-blue-300 rounded-md 
            shadow-[0_0_10px_#1e90ff] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading && <p className="text-center text-blue-300">Laden...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* SNAKE */}
            <section>
              <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                🐍 Snake Leaderboard
              </h2>
              <div className="overflow-hidden rounded-lg border border-green-500/40 shadow-[0_0_15px_#00ff80]">
                <table className="min-w-full bg-black/40 text-green-200">
                  <thead className="bg-green-900/40">
                    <tr>
                      <th className="px-4 py-2 border-b border-green-700">Rank</th>
                      <th className="px-4 py-2 border-b border-green-700">Benutzername</th>
                      <th className="px-4 py-2 border-b border-green-700">Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSnake.map((user) => {
                      const rank = snakeRanks[user.username]
                      return (
                        <tr key={user.username} className={getRankStyle(rank)}>
                          <td className="px-4 py-2 border-b border-green-900">{rank}</td>
                          <td className="px-4 py-2 border-b border-green-900">{user.username}</td>
                          <td className="px-4 py-2 border-b border-green-900">{user.snake_high_score}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* PONG */}
            <section>
              <h2 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                🏓 Pong Leaderboard
              </h2>
              <div className="overflow-hidden rounded-lg border border-pink-500/40 shadow-[0_0_15px_#ff00aa]">
                <table className="min-w-full bg-black/40 text-pink-200">
                  <thead className="bg-pink-900/40">
                    <tr>
                      <th className="px-4 py-2 border-b border-pink-700">Rank</th>
                      <th className="px-4 py-2 border-b border-pink-700">Benutzername</th>
                      <th className="px-4 py-2 border-b border-pink-700">Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPong.map((user) => {
                      const rank = pongRanks[user.username]
                      return (
                        <tr key={user.username} className={getRankStyle(rank)}>
                          <td className="px-4 py-2 border-b border-pink-900">{rank}</td>
                          <td className="px-4 py-2 border-b border-pink-900">{user.username}</td>
                          <td className="px-4 py-2 border-b border-pink-900">{user.pong_high_score}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-black border border-blue-500 shadow-[0_0_25px_#1e90ff] p-6 rounded-md w-full max-w-md">
            <h2 className="text-blue-300 text-xl font-bold mb-4">+ Neuer Benutzer</h2>

            <input
              type="text"
              placeholder="Benutzername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-blue-500 text-blue-300 rounded-md mb-4
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Abbrechen
              </button>

              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded 
                shadow-[0_0_10px_#1e90ff] hover:shadow-[0_0_20px_#1e90ff]"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
