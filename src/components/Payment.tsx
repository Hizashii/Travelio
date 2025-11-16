import { useState } from 'react'
import { motion } from 'motion/react'
import { Flight, Passenger } from '../types'
import { useCurrency } from '../contexts/CurrencyContext'

interface PaymentProps {
  flight: Flight
  passengers: Passenger[]
  totalPrice: number
  onComplete: () => void
  onBack: () => void
}

export default function Payment({ flight, passengers, totalPrice, onComplete, onBack }: PaymentProps) {
  const { formatPrice } = useCurrency()
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      newErrors.cardNumber = 'Invalid card number'
    }
    if (!cardName.trim()) {
      newErrors.cardName = 'Required'
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Invalid expiry (MM/YY)'
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Simulate payment processing
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

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
        ← Back to passenger details
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-2xl font-bold"
      >
        Payment
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-lg border bg-muted/50 p-4"
      >
        <h3 className="mb-2 font-semibold">Booking Summary</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>{flight.airline} • {passengers.length} passenger{passengers.length > 1 ? 's' : ''}</div>
          <div>{flight.departureTime} - {flight.arrivalTime} • {flight.duration}</div>
          <div className="pt-2 font-semibold text-foreground">
            Total: {formatPrice(totalPrice)}
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="block mb-2 text-sm font-medium">
            Card Number *
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full rounded-md border ${
              errors.cardNumber ? 'border-red-500' : 'border-input'
            } bg-background px-3 py-2 text-sm`}
            required
          />
          {errors.cardNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            className={`w-full rounded-md border ${
              errors.cardName ? 'border-red-500' : 'border-input'
            } bg-background px-3 py-2 text-sm`}
            required
          />
          {errors.cardName && (
            <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Expiry Date *
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full rounded-md border ${
                errors.expiry ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              required
            />
            {errors.expiry && (
              <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              CVV *
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              className={`w-full rounded-md border ${
                errors.cvv ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
              required
            />
            {errors.cvv && (
              <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          <strong>Note:</strong> This is a demo. No actual payment will be processed.
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Complete Booking
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

