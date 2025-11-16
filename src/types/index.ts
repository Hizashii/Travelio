export interface Destination {
  id: string
  name: string
  country: string
  image: string
  description: string
  basePrice: number
  currency: string
}

export interface Flight {
  id: string
  destinationId: string
  airline: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  basePrice: number
  departureDate: string
  returnDate?: string
  availableSeats: number
}

export interface BookingData {
  flight: Flight
  passengers: Passenger[]
  totalPrice: number
}

export interface Passenger {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  passportNumber?: string
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
}

