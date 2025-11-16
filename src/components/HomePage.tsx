import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Page = 'home' | 'destinations' | 'search' | 'admin'

interface HomePageProps {
  onNavigate?: (page: Page) => void
}

const featuredCountry = {
  name: 'THAILAND',
  subtitle: 'Discover temples, turquoise waters and vibrant night markets.',
  description:
    'Thailand is a Southeast Asian country known for its tropical beaches, opulent royal palaces, ancient ruins and ornate temples. Explore Bangkok’s energy, the calm of Chiang Mai, or the islands of Phuket and Krabi.',
}

const heroDestinations = [
  {
    id: 1,
    title: 'Tokyo',
    location: 'Tokyo',
    image: '/Tokyo.jpg',
    background: '/japan.jpg',
  },
  {
    id: 2,
    title: 'Kerala Backwaters',
    location: 'India',
    image: '/india.jpg',
    background: '/TajMahal.jpg',
  },
  {
    id: 3,
    title: 'Nusa Penida',
    location: 'Indonesia',
    image: '/bali.jpg',
    background: '/nusa.jpg',
  },
  {
    id: 4,
    title: 'Italy',
    location: 'Italy',
    image: '/italy.jpg',
    background: '/Italybg.jpg',
  },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const totalSlides = heroDestinations.length

  const goNext = () => setActiveSlide((prev) => (prev + 1) % totalSlides)
  const goPrev = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={activeSlide}
            src={heroDestinations[activeSlide].background}
            alt={heroDestinations[activeSlide].title}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.6, scale: 1.01 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
      </div>

{/* Left vertical line with numbered circles - hidden on mobile */}
<div className="hidden md:flex absolute left-4 lg:left-6 top-1/2 z-30 -translate-y-1/2 flex-col items-center">
  <div className="relative h-64 w-6 flex items-stretch">
    {/* Line */}
    <div className="relative mx-auto h-full w-[3px] rounded-full bg-white/18 overflow-hidden backdrop-blur-sm">
      {/* Active segment */}
      <motion.div
        className="absolute left-0 right-0 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
        initial={false}
        animate={{
          top:
            totalSlides > 1
              ? `${(activeSlide / (totalSlides - 1)) * 100}%`
              : '0%',
          height: `${100 / totalSlides}%`,
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </div>

    {/* Numbered circles */}
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1">
      {Array.from({ length: totalSlides }).map((_, idx) => {
        const isActive = idx === activeSlide
        return (
          <div key={idx} className="flex justify-center">
            <motion.button
              type="button"
              onClick={() => setActiveSlide(idx)}
              className="pointer-events-auto"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                  'border transition-all duration-300 backdrop-blur-sm',
                  isActive
                    ? 'border-sky-400 bg-sky-400/90 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.9)]'
                    : 'border-white/30 bg-black/30 text-white/60 hover:border-white/60 hover:text-white',
                ].join(' ')}
              >
                {idx + 1}
              </span>
            </motion.button>
          </div>
        )
      })}
    </div>
  </div>
</div>

      {/* Main hero content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto flex min-h-screen flex-col justify-center px-4 pb-20 pt-24 md:px-8 md:pb-24 md:pt-32">
          <div className="flex flex-1 flex-col gap-8 md:gap-12 lg:flex-row lg:items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-xl md:max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] md:text-xs font-medium uppercase">
                Featured destination
              </span>

              <h1 className="mt-4 md:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                {heroDestinations[activeSlide].location.toUpperCase()}
              </h1>

              <p className="mt-3 md:mt-4 text-base md:text-lg font-medium text-white/90">
                {featuredCountry.subtitle}
              </p>

              <p className="mt-2 md:mt-3 max-w-lg text-xs sm:text-sm md:text-base text-white/80">
                {featuredCountry.description}
              </p>

              <div className="mt-4 md:mt-6 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate && onNavigate('destinations')}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 md:px-6 md:py-3 text-xs md:text-sm font-semibold text-white shadow-lg shadow-sky-700/40 hover:bg-sky-400"
                >
                  Explore →
                </motion.button>
              </div>
            </motion.div>

            {/* Right: infinite horizontal carousel – active + all to the right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <div className="relative h-[16rem] sm:h-[18rem] md:h-[20rem] lg:h-[24rem] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                {heroDestinations.map((_, slotIndex) => {
                  const itemIndex = (activeSlide + slotIndex) % totalSlides
                  const dest = heroDestinations[itemIndex]
                  const isActive = slotIndex === 0
                  // Responsive spacing: smaller on mobile, larger on desktop
                  const baseX = slotIndex * 180 // Will be adjusted via CSS media queries if needed
                  const scale = isActive ? 1.05 : 0.9
                  const opacity = isActive ? 1 : 0.45
                  const zIndex = isActive ? 40 : 30 - slotIndex

                  return (
                    <motion.div
                      key={dest.id}
                      initial={false}
                      animate={{ x: baseX, scale, opacity, zIndex }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      onClick={() => setActiveSlide(itemIndex)}
                      className="absolute top-0 right-0 h-full w-56 sm:w-64 md:w-72 lg:w-80 cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-white/10 shadow-xl backdrop-blur-md"
                      style={{
                        boxShadow: isActive
                          ? '0 24px 40px rgba(0,0,0,0.45)'
                          : '0 18px 30px rgba(0,0,0,0.35)',
                      }}
                    >
                      <div className="relative h-full w-full">
                        <img
                          src={dest.image}
                          alt={dest.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100/90">
                              {dest.location}
                            </p>
                            <h3 className="mt-1 text-xs sm:text-sm md:text-base font-semibold">
                              {dest.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Arrows, 10% under carousel */}
                <div className="absolute left-1/2 top-[110%] flex -translate-x-1/2 items-center gap-3 text-xs text-white/85">
                  <motion.button
                    type="button"
                    onClick={goPrev}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white/90 backdrop-blur-sm hover:bg-black/40"
                  >
                    ‹
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={goNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white/90 backdrop-blur-sm hover:bg-black/40"
                  >
                    ›
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
