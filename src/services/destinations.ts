import { supabase } from '../lib/supabase'
import { Destination } from '../types'

// Database table name
const TABLE_NAME = 'destinations'

/**
 * Fetch all destinations from Supabase
 */
export async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, name, country, image, description, base_price, currency')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching destinations:', error)
    throw error
  }

  // Map database columns (snake_case) to TypeScript interface (camelCase)
  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    country: item.country,
    image: item.image,
    description: item.description,
    basePrice: Number(item.base_price),
    currency: item.currency || 'USD',
  })) as Destination[]
}

/**
 * Fetch a single destination by ID
 */
export async function fetchDestinationById(id: string): Promise<Destination | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, name, country, image, description, base_price, currency')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching destination:', error)
    return null
  }

  if (!data) return null

  // Map database columns to TypeScript interface
  return {
    id: data.id,
    name: data.name,
    country: data.country,
    image: data.image,
    description: data.description,
    basePrice: Number(data.base_price),
    currency: data.currency || 'USD',
  } as Destination
}

/**
 * Create a new destination
 */
export async function createDestination(destination: Omit<Destination, 'id'>): Promise<Destination> {
  // Map camelCase to snake_case for database
  const dbDestination = {
    name: destination.name,
    country: destination.country,
    image: destination.image,
    description: destination.description,
    base_price: destination.basePrice,
    currency: destination.currency || 'USD',
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([dbDestination])
    .select('id, name, country, image, description, base_price, currency')
    .single()

  if (error) {
    console.error('Error creating destination:', error)
    throw error
  }

  // Map back to camelCase
  return {
    id: data.id,
    name: data.name,
    country: data.country,
    image: data.image,
    description: data.description,
    basePrice: Number(data.base_price),
    currency: data.currency || 'USD',
  } as Destination
}

/**
 * Update an existing destination
 */
export async function updateDestination(
  id: string,
  updates: Partial<Omit<Destination, 'id'>>
): Promise<Destination> {
  // Map camelCase to snake_case for database
  const dbUpdates: any = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.country !== undefined) dbUpdates.country = updates.country
  if (updates.image !== undefined) dbUpdates.image = updates.image
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.basePrice !== undefined) dbUpdates.base_price = updates.basePrice
  if (updates.currency !== undefined) dbUpdates.currency = updates.currency

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(dbUpdates)
    .eq('id', id)
    .select('id, name, country, image, description, base_price, currency')
    .single()

  if (error) {
    console.error('Error updating destination:', error)
    throw error
  }

  // Map back to camelCase
  return {
    id: data.id,
    name: data.name,
    country: data.country,
    image: data.image,
    description: data.description,
    basePrice: Number(data.base_price),
    currency: data.currency || 'USD',
  } as Destination
}

/**
 * Delete a destination
 */
export async function deleteDestination(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting destination:', error)
    throw error
  }
}

