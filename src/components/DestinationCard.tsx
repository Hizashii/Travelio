import { motion } from 'motion/react'
import { Destination } from '../types'
import { useCurrency } from '../contexts/CurrencyContext'

interface DestinationCardProps {
  destination: Destination
  onSelect: (destination: Destination) => void
  index?: number
}

export default function DestinationCard({
  destination,
  onSelect,
  index = 0,
}: DestinationCardProps) {
  const { formatPrice } = useCurrency()

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(destination)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-md"
    >
      {/* Image */}
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden">
        <motion.img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          decoding="async"
          initial={false}
          animate={{ scale: 1 }}
          whileHover={{}}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 + 0.15 }}
        className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 text-white"
      >
        <h3 className="mb-1 text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
          {destination.name}
        </h3>
        <p className="mb-2 text-[10px] sm:text-xs md:text-sm text-white/90">
          {destination.country}
        </p>
        <p className="mb-3 sm:mb-4 line-clamp-2 text-[10px] sm:text-xs md:text-sm text-white/80">
          {destination.description}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-xs sm:text-sm md:text-lg font-semibold">
            From {formatPrice(destination.basePrice)}
          </span>
          <motion.button
            type="button"
            whileHover={{ x: 4, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            View flights →
          </motion.button>
        </div>
      </motion.div>
    </motion.article>
  )
}
