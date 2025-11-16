import { motion } from 'motion/react'
import { Flight, Passenger } from '../types'
import { useCurrency } from '../contexts/CurrencyContext'

interface ConfirmationProps {
  flight: Flight
  passengers: Passenger[]
  totalPrice: number
  bookingReference: string
  onNewBooking: () => void
}

export default function Confirmation({
  flight,
  passengers,
  totalPrice,
  bookingReference,
  onNewBooking,
}: ConfirmationProps) {
  const { formatPrice } = useCurrency()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-xl p-6 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-2 text-3xl font-bold"
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Your booking reference: <strong className="text-foreground">{bookingReference}</strong>
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6 rounded-lg border bg-muted/50 p-6"
      >
        <h3 className="mb-4 text-xl font-semibold">Flight Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Airline:</span>
            <span className="font-medium">{flight.airline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Departure:</span>
            <span className="font-medium">{flight.departureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Arrival:</span>
            <span className="font-medium">{flight.arrivalTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{flight.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stops:</span>
            <span className="font-medium">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Departure Date:</span>
            <span className="font-medium">
              {new Date(flight.departureDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6 rounded-lg border bg-muted/50 p-6"
      >
        <h3 className="mb-4 text-xl font-semibold">Passengers</h3>
        <div className="space-y-3">
          {passengers.map((passenger, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {passenger.firstName} {passenger.lastName}
              </span>
              <span className="font-medium">{passenger.email}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="mb-6 rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Paid:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
        className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
      >
        <strong>Next Steps:</strong>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>You will receive a confirmation email shortly</li>
          <li>Check-in opens 24 hours before departure</li>
          <li>Please arrive at the airport at least 2 hours before departure</li>
        </ul>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewBooking}
        className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Book Another Flight
      </motion.button>
    </motion.div>
  )
}

