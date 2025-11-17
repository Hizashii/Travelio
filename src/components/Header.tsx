import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Page = 'home' | 'news' | 'destinations' | 'contact' | 'search' | 'admin'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

const pages: { id: Page; label: string }[] = [
  { id: 'home',         label: 'Home' },
  { id: 'news',         label: 'News' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'contact',      label: 'Contact' },
]

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute top-0 left-0 right-0 z-50 w-full"
    >
       <div className="w-full max-w-6xl mx-auto flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 sm:px-6 md:px-8">
         {/* Logo */}
         <motion.button
           type="button"
           className="flex items-center gap-2 sm:gap-3 rounded-full px-1 sm:px-2 py-1 transition-opacity hover:opacity-80"
           onClick={() => onNavigate('home')}
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.97 }}
         >
           <img
             src="/Travelio.svg"
             alt="Travelio"
             className="h-[3.3rem] w-[3.3rem] sm:h-[4.4rem] sm:w-[4.4rem] md:h-[5.5rem] md:w-[5.5rem] lg:h-[6.6rem] lg:w-[6.6rem]"
             style={{ 
               objectFit: 'contain'
             }}
           />
         </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {pages.map((item, index) => {
            const isActive = currentPage === item.id

            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.25 }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(item.id)}
                className="relative text-white text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )
          })}
        </nav>

        {/* Right side: Search icon and Account */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Icon */}
          <motion.button
            type="button"
            onClick={() => onNavigate('search')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white transition-opacity hover:opacity-80"
            aria-label="Search"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          className="md:hidden rounded-full p-2 text-white transition-opacity hover:opacity-80"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.svg
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </motion.svg>
        </motion.button>

        <div className="md:hidden flex items-center gap-3">
          <motion.button
            type="button"
            onClick={() => onNavigate('search')}
            whileTap={{ scale: 0.9 }}
            className="text-white"
            aria-label="Search"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-black/80 backdrop-blur"
          >
            <div className="container mx-auto px-4 py-3 space-y-2">
              {pages.map((item, index) => {
                const isActive = currentPage === item.id

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-white transition-all relative"
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
