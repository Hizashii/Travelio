import { useState } from 'react'
import { motion } from 'motion/react'
import { Flight, Passenger } from '../types'
import { calculateDynamicPrice } from '../utils/pricing'
import { useCurrency } from '../contexts/CurrencyContext'

interface BookingFormProps {
  flight: Flight
  passengers: number
  onComplete: (passengers: Passenger[], totalPrice: number) => void
  onBack: () => void
}

export default function BookingForm({ flight, passengers, onComplete, onBack }: BookingFormProps) {
  const { formatPrice } = useCurrency()
  const [passengerData, setPassengerData] = useState<Passenger[]>(
    Array.from({ length: passengers }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: '',
    }))
  )

  const [errors, setErrors] = useState<Record<number, Partial<Passenger>>>({})

  const handleChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengerData]
    updated[index] = { ...updated[index], [field]: value }
    setPassengerData(updated)

    // Clear error for this field
    if (errors[index]) {
      const updatedErrors = { ...errors }
      delete updatedErrors[index][field]
      setErrors(updatedErrors)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<number, Partial<Passenger>> = {}

    passengerData.forEach((passenger, index) => {
      const passengerErrors: Partial<Passenger> = {}
      
      if (!passenger.firstName.trim()) passengerErrors.firstName = 'Required'
      if (!passenger.lastName.trim()) passengerErrors.lastName = 'Required'
      if (!passenger.email.trim()) {
        passengerErrors.email = 'Required'
      } else if (!/\S+@\S+\.\S+/.test(passenger.email)) {
        passengerErrors.email = 'Invalid email'
      }
      if (!passenger.phone.trim()) passengerErrors.phone = 'Required'
      if (!passenger.dateOfBirth) passengerErrors.dateOfBirth = 'Required'

      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const totalPrice = calculateDynamicPrice(flight) * passengers
      onComplete(passengerData, totalPrice)
    }
  }

  const pricePerPerson = calculateDynamicPrice(flight)
  const totalPrice = pricePerPerson * passengers

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-xl p-6 md:p-8"
    >
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to flights
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-2xl font-bold"
      >
        Passenger Details
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-lg border bg-muted/50 p-4"
      >
        <h3 className="mb-2 font-semibold">Flight Summary</h3>
        <div className="text-sm text-muted-foreground">
          <div>{flight.airline} • {flight.departureTime} - {flight.arrivalTime}</div>
          <div>{flight.duration} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {passengerData.map((passenger, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="rounded-lg border p-6"
          >
            <h3 className="mb-4 text-lg font-semibold">
              Passenger {index + 1}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  First Name *
                </label>
                <input
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                  className={`w-full rounded-md border ${
                    errors[index]?.firstName ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm`}
                  required
                />
                {errors[index]?.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors[index].firstName}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                  className={`w-full rounded-md border ${
                    errors[index]?.lastName ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm`}
                  required
                />
                {errors[index]?.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors[index].lastName}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handleChange(index, 'email', e.target.value)}
                  className={`w-full rounded-md border ${
                    errors[index]?.email ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm`}
                  required
                />
                {errors[index]?.email && (
                  <p className="mt-1 text-xs text-red-500">{errors[index].email}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  className={`w-full rounded-md border ${
                    errors[index]?.phone ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm`}
                  required
                />
                {errors[index]?.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors[index].phone}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={passenger.dateOfBirth}
                  onChange={(e) => handleChange(index, 'dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-md border ${
                    errors[index]?.dateOfBirth ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm`}
                  required
                />
                {errors[index]?.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">{errors[index].dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Passport Number (Optional)
                </label>
                <input
                  type="text"
                  value={passenger.passportNumber || ''}
                  onChange={(e) => handleChange(index, 'passportNumber', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + passengers * 0.1 }}
          className="rounded-lg border bg-muted/50 p-6"
        >
          <h3 className="mb-4 font-semibold">Price Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price per person:</span>
              <span>{formatPrice(pricePerPerson)}</span>
            </div>
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span>{passengers}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Continue to Payment
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

