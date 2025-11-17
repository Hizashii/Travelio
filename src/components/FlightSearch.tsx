import { useState } from 'react'
import { motion } from 'motion/react'
import { SearchParams } from '../types'

interface FlightSearchProps {
  onSearch: (params: SearchParams) => void
  initialParams?: Partial<SearchParams>
}

export default function FlightSearch({ onSearch, initialParams }: FlightSearchProps) {
  const [origin, setOrigin] = useState(initialParams?.origin || 'Warsaw (Any)')
  const [destination, setDestination] = useState(initialParams?.destination || 'Sofia (SOF)')
  const [departureDate, setDepartureDate] = useState(
    initialParams?.departureDate || '2025-12-19'
  )
  const [returnDate, setReturnDate] = useState(initialParams?.returnDate || '2026-01-03')
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(!!initialParams?.returnDate || true)
  const [passengers, setPassengers] = useState(initialParams?.passengers || 2)
  const [cabinClass, setCabinClass] = useState('Economy')
  const [addNearbyAirportsFrom, setAddNearbyAirportsFrom] = useState(false)
  const [addNearbyAirportsTo, setAddNearbyAirportsTo] = useState(false)
  const [directFlights, setDirectFlights] = useState(false)

  const handleSwap = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: isRoundTrip ? returnDate : undefined,
      passengers,
    })
  }

  const minDate = new Date().toISOString().split('T')[0]
  const minReturnDate = departureDate || minDate

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 sm:pt-32 pb-12 sm:pb-16">
      {/* Search form */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">Search Flights</h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base">Find the best flights for your next trip</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 p-4 sm:p-6 md:p-8 text-xs shadow-2xl backdrop-blur-md md:text-sm"
          >
            {/* Trip type selector */}
            <div className="mb-4 sm:mb-6 flex items-center justify-center gap-4">
              <div className="inline-flex items-center rounded-full bg-white/10 p-0.5 sm:p-1">
                <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all">
                  <input
                    type="radio"
                    checked={isRoundTrip}
                    onChange={() => setIsRoundTrip(true)}
                    className="h-3 w-3 accent-sky-500"
                  />
                  <span className={`text-[10px] sm:text-xs font-medium ${isRoundTrip ? 'text-white' : 'text-slate-300'}`}>Return</span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all">
                  <input
                    type="radio"
                    checked={!isRoundTrip}
                    onChange={() => setIsRoundTrip(false)}
                    className="h-3 w-3 accent-sky-500"
                  />
                  <span className={`text-[10px] sm:text-xs font-medium ${!isRoundTrip ? 'text-white' : 'text-slate-300'}`}>One-way</span>
                </label>
              </div>
            </div>

            {/* Search row */}
            <div className="space-y-4">
              {/* First row: From, Swap, To */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]">
                {/* From */}
                <div className="flex flex-col">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    From
                  </label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 hover:border-sky-500/50 transition-colors h-12">
                    <svg className="h-5 w-5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="City or airport"
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={addNearbyAirportsFrom}
                      onChange={(e) => setAddNearbyAirportsFrom(e.target.checked)}
                      className="h-3.5 w-3.5 accent-sky-500"
                    />
                    <span>Include nearby airports</span>
                  </label>
                </div>

                {/* Swap */}
                <div className="flex items-center justify-center">
                  <motion.button
                    type="button"
                    onClick={handleSwap}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-sky-400 hover:bg-slate-700 hover:border-sky-500/50 transition-colors mt-6"
                    aria-label="Swap origin and destination"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* To */}
                <div className="flex flex-col">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    To
                  </label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 hover:border-sky-500/50 transition-colors h-12">
                    <svg className="h-5 w-5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="City or airport"
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={directFlights}
                      onChange={(e) => setDirectFlights(e.target.checked)}
                      className="h-3.5 w-3.5 accent-sky-500"
                    />
                    <span>Direct flights only</span>
                  </label>
                </div>
              </div>

              {/* Second row: Depart, Return (conditional), Travellers & Cabin, Search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Depart */}
                <div className="flex flex-col">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Depart
                  </label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 hover:border-sky-500/50 transition-colors h-12">
                    <svg className="h-5 w-5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={minDate}
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                    />
                  </div>
                  {/* Empty space to match height with fields that have checkboxes */}
                  <div className="mt-2 h-5"></div>
                </div>

                {/* Return */}
                <div className={`flex flex-col ${isRoundTrip ? '' : 'hidden'}`}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Return
                  </label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 hover:border-sky-500/50 transition-colors h-12">
                    <svg className="h-5 w-5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={minReturnDate}
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                    />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={addNearbyAirportsTo}
                      onChange={(e) => setAddNearbyAirportsTo(e.target.checked)}
                      className="h-3.5 w-3.5 accent-sky-500"
                    />
                    <span>Include nearby airports</span>
                  </label>
                </div>

                {/* Travellers & Cabin */}
                <div className={`flex flex-col ${isRoundTrip ? '' : 'sm:col-span-2 lg:col-span-2'}`}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Travellers & Cabin
                  </label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-white/10 px-4 py-3 h-12">
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num} className="bg-slate-800">
                          {num} {num === 1 ? 'traveller' : 'travellers'}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-500">•</span>
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      className="flex-1 bg-transparent text-sm font-medium text-white outline-none cursor-pointer"
                    >
                      <option value="Economy" className="bg-slate-800">Economy</option>
                      <option value="Premium Economy" className="bg-slate-800">Premium Economy</option>
                      <option value="Business" className="bg-slate-800">Business</option>
                      <option value="First" className="bg-slate-800">First</option>
                    </select>
                  </div>
                  {/* Empty space to match height with fields that have checkboxes */}
                  <div className="mt-2 h-5"></div>
                </div>

                {/* Search Button */}
                <div className={`flex items-start ${isRoundTrip ? 'sm:col-span-2 lg:col-span-1' : 'sm:col-span-2'}`}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-700/50 hover:bg-sky-400 transition-colors mt-6"
                  >
                    Search Flights
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
