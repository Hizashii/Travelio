import { motion } from 'motion/react'
import { Destination } from '../types'
import DestinationCard from './DestinationCard'

interface DestinationsSectionProps {
  destinations: Destination[]
  onDestinationSelect: (destination: Destination) => void
}

export default function DestinationsSection({
  destinations,
  onDestinationSelect,
}: DestinationsSectionProps) {
  return (
    <section className="relative bg-slate-950">
      {/* soft gradient + glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/70 to-slate-950" />
      <div className="pointer-events-none absolute -top-40 right-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-slate-200">
            Popular destinations
          </span>
          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Where people are flying right now
          </h2>
          <p className="mt-2 sm:mt-3 mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-300 px-4">
            Explore a curated list of cities and islands with great connections, fair prices and unforgettable views.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={onDestinationSelect}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
