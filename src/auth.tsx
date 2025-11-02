import { createContext, useContext, useEffect, useState } from 'react'
import { mockLogin, mockValidateToken } from './services/login.mock'
import type { ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email: string
  token: string
}

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  user: User | null
}

const AuthContext = createContext<AuthContext | undefined>(undefined)
const storageKey = 'auth-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    const token = localStorage.getItem(storageKey)
    if (token) {
      mockValidateToken(token).then(({ valid, user: userData }) => {
        if (valid) {
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem(storageKey)
        }
      })
    }
    setIsLoading(false)
  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  const login = async (username: string, password: string) => {
    try {
      const userData = await mockLogin(username, password)
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)

        // Persist token in localStorage
        localStorage.setItem(storageKey, userData.token)
      }
    } catch (error) {
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(storageKey)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
