import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    const token = localStorage.getItem('tumbuh_token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await api.get('/me')

      setUser(
        response.data.user ?? response.data
      )
    } catch (error) {
      console.error('Gagal mengambil user:', error)

      localStorage.removeItem('tumbuh_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/login', {
      email,
      password,
    })

    const token = response.data.token

    localStorage.setItem(
      'tumbuh_token',
      token
    )

    const meResponse = await api.get('/me')

    const loggedUser =
      meResponse.data.user ?? meResponse.data

    setUser(loggedUser)

    return loggedUser
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout API gagal:', error)
    }

    localStorage.removeItem('tumbuh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}