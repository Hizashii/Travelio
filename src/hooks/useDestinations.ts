import { useState, useEffect } from 'react'
import { Destination } from '../types'
import { fetchDestinations } from '../services/destinations'

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadDestinations() {
      try {
        setLoading(true)
        const data = await fetchDestinations()
        setDestinations(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load destinations'))
        console.error('Error loading destinations:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await fetchDestinations()
      setDestinations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load destinations'))
    } finally {
      setLoading(false)
    }
  }

  return { destinations, loading, error, refetch }
}

