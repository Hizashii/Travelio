import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Header from './components/Header'
import HomePage from './components/HomePage'
import NewsPage from './components/NewsPage'
import ContactPage from './components/ContactPage'
import DestinationsSection from './components/DestinationsSection'
import FlightSearch from './components/FlightSearch'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import FlightList from './components/FlightList'
import BookingForm from './components/BookingForm'
import Payment from './components/Payment'
import Confirmation from './components/Confirmation'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import LoadingScreen from './components/LoadingScreen'
import { generateFlights } from './data/flights'
import { Destination, Flight, SearchParams, Passenger } from './types'
import { useDestinations } from './hooks/useDestinations'
import { isAdminAuthenticated } from './services/auth'

gsap.registerPlugin(ScrollTrigger)

type Page = 'home' | 'news' | 'destinations' | 'contact' | 'search' | 'flights' | 'booking' | 'payment' | 'confirmation' | 'admin'

function App() {
  const { destinations, loading: destinationsLoading, refetch: refetchDestinations } = useDestinations()
  
  // Initialize page from URL hash, default to 'home'
  const getPageFromHash = (): Page => {
    const hash = window.location.hash.slice(1) // Remove the '#'
    const validPages: Page[] = ['home', 'news', 'destinations', 'contact', 'search', 'flights', 'booking', 'payment', 'confirmation', 'admin']
    if (hash && validPages.includes(hash as Page)) {
      return hash as Page
    }
    return 'home'
  }

  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash)
  const [adminAuthenticated, setAdminAuthenticated] = useState(isAdminAuthenticated())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [availableFlights, setAvailableFlights] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [bookingReference, setBookingReference] = useState('')

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash()
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Set initial hash if none exists
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = currentPage
    }
  }, [])

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after images/fonts fully load
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  const handleNavigate = (page: Page) => {
    // Check authentication for admin route
    if (page === 'admin' && !isAdminAuthenticated()) {
      setCurrentPage('admin') // This will show login
      window.location.hash = 'admin'
      return
    }
    setCurrentPage(page)
    window.location.hash = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination)
    setSearchParams({
      origin: 'New York',
      destination: destination.name,
      departureDate: new Date().toISOString().split('T')[0],
      passengers: 1,
    })
    handleNavigate('search')
  }

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
    
    // Find destination by name or use selected destination
    const dest = selectedDestination || destinations.find(d => 
      d.name.toLowerCase() === params.destination.toLowerCase()
    )

    if (dest) {
      const flights = generateFlights(dest.id, params.departureDate)
      setAvailableFlights(flights)
      setSelectedFlight(null)
      handleNavigate('flights')
    } else {
      // Generate flights for any destination
      const flights = generateFlights('generic', params.departureDate)
      setAvailableFlights(flights)
      setSelectedFlight(null)
      handleNavigate('flights')
    }
  }

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight)
    if (searchParams) {
      setPassengers([])
      handleNavigate('booking')
    }
  }

  const handleBookingComplete = (passengerData: Passenger[], price: number) => {
    setPassengers(passengerData)
    setTotalPrice(price)
    handleNavigate('payment')
  }

  const handlePaymentComplete = () => {
    // Generate booking reference
    const ref = 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase()
    setBookingReference(ref)
    handleNavigate('confirmation')
  }

  const handleNewBooking = () => {
    setCurrentPage('home')
    setSelectedDestination(null)
    setSearchParams(null)
    setAvailableFlights([])
    setSelectedFlight(null)
    setPassengers([])
    setTotalPrice(0)
    setBookingReference('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage onNavigate={handleNavigate} />
        )

      case 'news':
        return <NewsPage />

      case 'destinations':
        return (
          <>
            {destinationsLoading ? (
              <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-white">Loading destinations...</p>
                </div>
              </div>
            ) : (
              <>
                <DestinationsSection
                  destinations={destinations}
                  onDestinationSelect={handleDestinationSelect}
                />
                <FAQ />
                <Footer />
              </>
            )}
          </>
        )

      case 'contact':
        return <ContactPage />

      case 'search':
        return (
          <FlightSearch
            onSearch={handleSearch}
            initialParams={searchParams || undefined}
          />
        )

      case 'flights':
        return (
          <div className="min-h-screen py-12 sm:py-16 md:py-20 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
              {searchParams && (
                <div className="mb-6 text-center">
                  <button
                    onClick={() => handleNavigate('search')}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    ← Modify search
                  </button>
                </div>
              )}
              <FlightList
                flights={availableFlights}
                onSelect={handleFlightSelect}
              />
            </div>
          </div>
        )

      case 'booking':
        return (
          <div className="min-h-screen py-12 sm:py-16 md:py-20 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
              {selectedFlight && searchParams && (
                <BookingForm
                  flight={selectedFlight}
                  passengers={searchParams.passengers}
                  onComplete={handleBookingComplete}
                  onBack={() => handleNavigate('flights')}
                />
              )}
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="min-h-screen py-12 sm:py-16 md:py-20 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
              {selectedFlight && (
                <Payment
                  flight={selectedFlight}
                  passengers={passengers}
                  totalPrice={totalPrice}
                  onComplete={handlePaymentComplete}
                  onBack={() => handleNavigate('booking')}
                />
              )}
            </div>
          </div>
        )

      case 'confirmation':
        return (
          <div className="min-h-screen py-12 sm:py-16 md:py-20 bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
              {selectedFlight && (
                <Confirmation
                  flight={selectedFlight}
                  passengers={passengers}
                  totalPrice={totalPrice}
                  bookingReference={bookingReference}
                  onNewBooking={handleNewBooking}
                />
              )}
            </div>
          </div>
        )

      case 'admin':
        // Check authentication for admin route
        if (!adminAuthenticated) {
          return (
            <AdminLogin onLoginSuccess={() => setAdminAuthenticated(true)} />
          )
        }
        return (
          <AdminDashboard 
            onDestinationAdded={refetchDestinations}
            onLogout={() => {
              setAdminAuthenticated(false)
              handleNavigate('home')
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Loading Screen - shows only on first load */}
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}

        {/* Hide header on admin login page and during loading */}
        {!isLoading && !(currentPage === 'admin' && !adminAuthenticated) && (
        <Header
          onNavigate={(page) => handleNavigate(page as Page)}
          currentPage={
            currentPage === 'home' ? 'home' :
            currentPage === 'news' ? 'news' :
            currentPage === 'destinations' ? 'destinations' :
            currentPage === 'contact' ? 'contact' :
            currentPage === 'admin' ? 'admin' : 'search'
          }
        />
      )}
        
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </CurrencyProvider>
  )
}

export default App
