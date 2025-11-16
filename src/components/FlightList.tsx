import { motion } from 'motion/react'
import { Flight } from '../types'
import { calculateDynamicPrice, getDaysUntilDeparture, getPriceLabel } from '../utils/pricing'
import { useCurrency } from '../contexts/CurrencyContext'

interface FlightListProps {
  flights: Flight[]
  onSelect: (flight: Flight) => void
}

export default function FlightList({ flights, onSelect }: FlightListProps) {
  const { formatPrice } = useCurrency()
  
  if (flights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-base sm:text-lg text-slate-300">No flights found. Please try different search criteria.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white"
      >
        Available Flights
      </motion.h2>
      {flights.map((flight, index) => {
        const dynamicPrice = calculateDynamicPrice(flight)
        const daysUntil = getDaysUntilDeparture(flight.departureDate)
        const priceLabel = getPriceLabel(daysUntil)

        if (daysUntil < 0) return null

        return (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="rounded-lg border border-white/10 bg-slate-900/70 p-4 sm:p-5 md:p-6 shadow-sm transition-all hover:shadow-md hover:border-sky-500/50"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-2 gap-2 sm:gap-0">
                  <div className="text-base sm:text-lg font-semibold text-white">{flight.airline}</div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    {flight.availableSeats} seats left
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 mb-3 sm:mb-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{flight.departureTime}</div>
                    <div className="text-xs sm:text-sm text-slate-400">Departure</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-dashed border-slate-600"></div>
                      <div className="px-2 text-[10px] sm:text-xs text-slate-400">{flight.duration}</div>
                      <div className="flex-1 border-t border-dashed border-slate-600"></div>
                    </div>
                    <div className="text-center text-[10px] sm:text-xs text-slate-400 mt-1">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{flight.arrivalTime}</div>
                    <div className="text-xs sm:text-sm text-slate-400">Arrival</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className={`px-2 py-1 rounded ${
                    daysUntil <= 7 
                      ? 'bg-red-500/20 text-red-300'
                      : daysUntil <= 30
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {priceLabel}
                  </span>
                  {daysUntil > 0 && (
                    <span className="text-slate-400">
                      {daysUntil} day{daysUntil !== 1 ? 's' : ''} until departure
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-end md:items-end justify-center gap-3 sm:gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 md:border-l md:pl-6 border-white/10 md:min-w-[150px]">
                <div className="text-2xl sm:text-3xl font-bold text-sky-400">
                  {formatPrice(dynamicPrice)}
                </div>
                {dynamicPrice !== flight.basePrice && (
                  <div className="text-xs sm:text-sm text-slate-500 line-through">
                    {formatPrice(flight.basePrice)}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(flight)}
                  className="w-full sm:w-auto md:w-full rounded-lg bg-sky-500 px-5 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                >
                  Select
                </motion.button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

