import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Destination } from '../types'
import { updateDestination, deleteDestination, fetchDestinations } from '../services/destinations'
import { supabase } from '../lib/supabase'
import { logoutAdmin, getAdminUsername } from '../services/auth'

interface AdminDashboardProps {
  onDestinationAdded?: () => void
  onLogout?: () => void
}

export default function AdminDashboard({ onDestinationAdded, onLogout }: AdminDashboardProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    country: '',
    image: '',
    description: '',
    basePrice: '',
    currency: 'USD',
  })

  // Load destinations on mount
  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      setLoading(true)
      const data = await fetchDestinations()
      setDestinations(data)
      setError(null)
    } catch (err) {
      setError('Failed to load destinations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!formData.id || !formData.name || !formData.country || !formData.image || !formData.description || !formData.basePrice) {
      setError('Please fill in all required fields')
      return
    }

    const basePrice = parseFloat(formData.basePrice)
    if (isNaN(basePrice) || basePrice <= 0) {
      setError('Base price must be a positive number')
      return
    }

    try {
      setLoading(true)
      const destinationData: Omit<Destination, 'id'> = {
        name: formData.name,
        country: formData.country,
        image: formData.image,
        description: formData.description,
        basePrice: basePrice,
        currency: formData.currency,
      }

      if (isEditing) {
        await updateDestination(isEditing, destinationData)
        setSuccess('Destination updated successfully!')
      } else {
        // For new destinations, we need to insert with the id
        const { error } = await supabase
          .from('destinations')
          .insert([{
            id: formData.id,
            name: destinationData.name,
            country: destinationData.country,
            image: destinationData.image,
            description: destinationData.description,
            base_price: destinationData.basePrice,
            currency: destinationData.currency,
          }])
          .select('id, name, country, image, description, base_price, currency')
          .single()

        if (error) throw error
        setSuccess('Destination added successfully!')
      }

      // Reset form
      setFormData({
        id: '',
        name: '',
        country: '',
        image: '',
        description: '',
        basePrice: '',
        currency: 'USD',
      })
      setIsEditing(null)
      
      // Reload destinations
      await loadDestinations()
      
      // Notify parent
      if (onDestinationAdded) {
        onDestinationAdded()
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save destination')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (destination: Destination) => {
    setFormData({
      id: destination.id,
      name: destination.name,
      country: destination.country,
      image: destination.image,
      description: destination.description,
      basePrice: destination.basePrice.toString(),
      currency: destination.currency,
    })
    setIsEditing(destination.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) {
      return
    }

    try {
      setLoading(true)
      await deleteDestination(id)
      setSuccess('Destination deleted successfully!')
      await loadDestinations()
      if (onDestinationAdded) {
        onDestinationAdded()
      }
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete destination')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      country: '',
      image: '',
      description: '',
      basePrice: '',
      currency: 'USD',
    })
    setIsEditing(null)
    setError(null)
  }

  return (
    <div className="min-h-screen py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage travel destinations • Logged in as: <span className="font-semibold text-foreground">{getAdminUsername() || 'Admin'}</span>
              </p>
            </div>
            <motion.button
              onClick={() => {
                logoutAdmin()
                if (onLogout) onLogout()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
          >
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}

        {/* Add/Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-card rounded-lg shadow-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            {isEditing ? 'Edit Destination' : 'Add New Destination'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  ID * <span className="text-muted-foreground text-xs">(unique identifier, e.g., "tokyo")</span>
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={!!isEditing}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                  required
                  placeholder="tokyo"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  placeholder="Tokyo"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  placeholder="Japan"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  placeholder="/japan.jpg"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Base Price (USD) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  placeholder="850"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                placeholder="A vibrant blend of traditional culture and cutting-edge technology."
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Destination' : 'Add Destination'}
              </motion.button>

              {isEditing && (
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-lg border border-input bg-background text-foreground hover:bg-muted"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Destinations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg shadow-xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Existing Destinations ({destinations.length})</h2>
            <motion.button
              onClick={loadDestinations}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg border border-input bg-background text-sm hover:bg-muted"
            >
              Refresh
            </motion.button>
          </div>

          {loading && destinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-muted-foreground">Loading destinations...</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No destinations found. Add your first destination above!
            </div>
          ) : (
            <div className="space-y-4">
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${destination.image}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {destination.description}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        From {destination.currency} {destination.basePrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEdit(destination)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(destination.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

