'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'



export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [stayLoggedIn, setStayLoggedIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter() 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        console.log('Login successful!', { username, stayLoggedIn })
        alert('Erfolgreich angemeldet!')
        router.push('/projekte') 
      } else {
        setError('Ungültiger Benutzername oder Kennwort')
      }
      setLoading(false)
    }, 1500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 rounded-xl bg-white p-8 shadow-lg border border-gray-200"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Melden Sie sich mit Ihren Zugangsdaten an</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Benutzername
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Geben Sie Ihren Benutzernamen ein"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-12 px-4 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Kennwort
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ihr Kennwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 px-4 pr-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Stay Logged In Checkbox */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="stayLoggedIn"
              checked={stayLoggedIn}
              onCheckedChange={(checked) => setStayLoggedIn(checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              disabled={loading}
            />
            <Label
              htmlFor="stayLoggedIn"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              ✔ Angemeldet bleiben
            </Label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Einloggen...
              </>
            ) : (
              'Einloggen'
            )}
          </Button>

          {/* Demo Credentials Hint */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Demo Zugangsdaten: <strong>admin</strong> / <strong>admin</strong>
            </p>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Probleme beim Login?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Hilfe erhalten
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}