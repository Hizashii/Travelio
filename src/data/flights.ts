import { Flight } from '../types'

// Generate flights for different destinations
export function generateFlights(destinationId: string, departureDate: string): Flight[] {
  const airlines = ['SkyWings', 'GlobalAir', 'Pacific Express', 'Continental Airlines', 'StarFly']
  const flights: Flight[] = []

  // Generate 3-5 flights per destination
  const numFlights = 3 + Math.floor(Math.random() * 3)

  for (let i = 0; i < numFlights; i++) {
    const hour = 6 + i * 4 + Math.floor(Math.random() * 2)
    const minute = Math.floor(Math.random() * 4) * 15
    const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    
    // Calculate arrival time (add flight duration)
    const durationHours = 8 + Math.floor(Math.random() * 12)
    const durationMinutes = Math.floor(Math.random() * 4) * 15
    const arrivalHour = (hour + durationHours) % 24
    const arrivalMinute = (minute + durationMinutes) % 60
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`
    
    const duration = `${durationHours}h ${durationMinutes}m`
    const stops = Math.floor(Math.random() * 3) // 0-2 stops
    
    // Base price varies by destination and flight quality
    const basePrice = 300 + Math.floor(Math.random() * 400) + (stops === 0 ? 100 : 0)
    const availableSeats = 5 + Math.floor(Math.random() * 45)

    flights.push({
      id: `flight-${destinationId}-${i}`,
      destinationId,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departureTime,
      arrivalTime,
      duration,
      stops,
      basePrice,
      departureDate,
      availableSeats,
    })
  }

  // Sort by departure time
  return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
}

