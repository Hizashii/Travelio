import { supabase } from '../lib/supabase'

const ADMIN_TABLE = 'admin_users'

export interface AdminUser {
  id: string
  username: string
  password: string // In production, this should be hashed!
}

/**
 * Authenticate admin user
 */
export async function loginAdmin(username: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(ADMIN_TABLE)
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) {
      return false
    }

    // Store session in localStorage
    localStorage.setItem('admin_authenticated', 'true')
    localStorage.setItem('admin_username', username)
    localStorage.setItem('admin_session', Date.now().toString())

    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  const authenticated = localStorage.getItem('admin_authenticated')
  const sessionTime = localStorage.getItem('admin_session')
  
  if (!authenticated || authenticated !== 'true') {
    return false
  }

  // Check if session is older than 24 hours
  if (sessionTime) {
    const sessionAge = Date.now() - parseInt(sessionTime)
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (sessionAge > twentyFourHours) {
      logoutAdmin()
      return false
    }
  }

  return true
}

/**
 * Logout admin
 */
export function logoutAdmin(): void {
  localStorage.removeItem('admin_authenticated')
  localStorage.removeItem('admin_username')
  localStorage.removeItem('admin_session')
}

/**
 * Get current admin username
 */
export function getAdminUsername(): string | null {
  return localStorage.getItem('admin_username')
}

