import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getStoredUser, getStoredToken, clearAuth } from '@/api/client'

type User = { id: number; email: string } | null

const AuthContext = createContext<{
  user: User
  setUser: (u: User) => void
  logout: () => void
}>({ user: null, setUser: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(() => getStoredToken() && getStoredUser())

  const setUser = useCallback((u: User) => {
    setUserState(u)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUserState(null)
    window.dispatchEvent(new Event('storage'))
  }, [])

  useEffect(() => {
    const sync = () => setUserState(getStoredToken() && getStoredUser() ? getStoredUser() : null)
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
