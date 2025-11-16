import { Flight } from '../types'

/**
 * Calculate dynamic pricing based on how close the departure date is
 * Prices increase as the departure date approaches
 */
export function calculateDynamicPrice(flight: Flight): number {
  const departureDate = new Date(flight.departureDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const daysUntilDeparture = Math.ceil(
    (departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  let multiplier = 1.0

  if (daysUntilDeparture < 0) {
    // Past date - not available
    return 0
  } else if (daysUntilDeparture <= 3) {
    // Last minute (0-3 days) - 200% markup
    multiplier = 2.0
  } else if (daysUntilDeparture <= 7) {
    // Very short notice (4-7 days) - 150% markup
    multiplier = 1.5
  } else if (daysUntilDeparture <= 14) {
    // Short notice (8-14 days) - 125% markup
    multiplier = 1.25
  } else if (daysUntilDeparture <= 30) {
    // Medium notice (15-30 days) - 110% markup
    multiplier = 1.1
  } else if (daysUntilDeparture <= 60) {
    // Standard (31-60 days) - base price
    multiplier = 1.0
  } else if (daysUntilDeparture <= 90) {
    // Early booking (61-90 days) - 5% discount
    multiplier = 0.95
  } else {
    // Very early booking (90+ days) - 10% discount
    multiplier = 0.9
  }

  // Also factor in available seats (fewer seats = higher price)
  const seatMultiplier = flight.availableSeats <= 10 ? 1.15 : 1.0

  return Math.round(flight.basePrice * multiplier * seatMultiplier)
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function getDaysUntilDeparture(departureDate: string): number {
  const departure = new Date(departureDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return Math.ceil((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getPriceLabel(daysUntilDeparture: number): string {
  if (daysUntilDeparture < 0) return 'Not Available'
  if (daysUntilDeparture <= 3) return 'Last Minute'
  if (daysUntilDeparture <= 7) return 'Very Short Notice'
  if (daysUntilDeparture <= 14) return 'Short Notice'
  if (daysUntilDeparture <= 30) return 'Standard'
  if (daysUntilDeparture <= 60) return 'Standard'
  if (daysUntilDeparture <= 90) return 'Early Booking'
  return 'Very Early Booking'
}

