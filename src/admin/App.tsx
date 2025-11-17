import { useEffect, useState } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import AdminLogin from '../components/AdminLogin'
import { isAdminAuthenticated } from '../services/auth'

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated())

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated())
  }, [])

  if (!authenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setAuthenticated(true)}
      />
    )
  }

  return (
    <AdminDashboard
      onLogout={() => setAuthenticated(false)}
    />
  )
}


