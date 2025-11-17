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
import SimpleContentPage from './components/SimpleContentPage'
import { generateFlights } from './data/flights'
import { Destination, Flight, SearchParams, Passenger } from './types'
import { useDestinations } from './hooks/useDestinations'
import { isAdminAuthenticated } from './services/auth'

gsap.registerPlugin(ScrollTrigger)

type StaticPage =
  | 'about'
  | 'careers'
  | 'press'
  | 'blog'
  | 'help'
  | 'safety'
  | 'accessibility'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'disclaimer'

type Page =
  | 'home'
  | 'news'
  | 'destinations'
  | 'contact'
  | 'search'
  | 'flights'
  | 'booking'
  | 'payment'
  | 'confirmation'
  | 'admin'
  | StaticPage

const staticPages: Record<StaticPage, { title: string; intro: string; sections: { title: string; body: string; bullets?: string[] }[] }> = {
  about: {
    title: 'About Travelio',
    intro: 'We are a collective of travel editors, designers, and engineers building modern tools that inspire and empower travelers everywhere.',
    sections: [
      {
        title: 'Our Story',
        body: 'Travelio was founded with a simple idea: travel planning should feel as inspiring as the journey itself. We design immersive discovery experiences, gather reliable data, and curate stories that make it easier to choose your next adventure.',
      },
      {
        title: 'What We Believe',
        body: 'Great trips start with trustworthy information, beautiful design, and frictionless booking. We collaborate with local experts, airlines, and creators to surface perspectives you can rely on.',
        bullets: ['Curated guides from editors on the ground', 'Tools that keep every itinerary organized', 'Partners that share our commitment to service'],
      },
    ],
  },
  careers: {
    title: 'Careers at Travelio',
    intro: 'Join a distributed team of travel lovers, storytellers, and engineers building the future of trip planning.',
    sections: [
      {
        title: 'Open Roles',
        body: 'We are hiring across product design, engineering, content, and partnerships. Remote-first with hubs in Lisbon, Toronto, and Singapore.',
        bullets: ['Senior Product Designer', 'Frontend Engineer', 'Travel Editor', 'Partnerships Lead'],
      },
      {
        title: 'Why Work With Us',
        body: 'Competitive compensation, annual travel stipend, flexible hours, and teammates who obsess over excellent craftsmanship.',
      },
    ],
  },
  press: {
    title: 'Press & Media',
    intro: 'Download our media kit, request interviews, or learn more about the latest Travelio launches.',
    sections: [
      {
        title: 'Media Resources',
        body: 'Access high-resolution logos, product screenshots, and executive bios in our media room. Email press@travelio.com for tailored assets.',
      },
      {
        title: 'Press Inquiries',
        body: 'We love sharing product milestones, destination data, and travel trends. Send accreditation details and deadlines and our comms team will respond within 24 hours.',
      },
    ],
  },
  blog: {
    title: 'Travelio Journal',
    intro: 'Product announcements, behind-the-scenes design notes, and interviews with creators reimagining travel.',
    sections: [
      {
        title: 'Latest Highlights',
        body: 'From new destination data partnerships to design experiments, the Journal is where we share what we are learning.',
      },
      {
        title: 'Write For Us',
        body: 'We accept pitches from travel writers and photographers. Include links to previous work and a short summary of your story idea.',
      },
    ],
  },
  help: {
    title: 'Help Center',
    intro: 'Everything you need to get the most out of Travelio: account support, booking FAQs, and troubleshooting tips.',
    sections: [
      {
        title: 'Popular Topics',
        body: 'Find instant answers for managing your profile, updating preferences, and syncing currency settings.',
        bullets: ['Resetting your password', 'Managing saved destinations', 'Updating notification preferences'],
      },
      {
        title: 'Need More Help?',
        body: 'Chat with our support team 24/7 or email support@travelio.com. Average response time: under one hour.',
      },
    ],
  },
  safety: {
    title: 'Safety & Security',
    intro: 'Our commitment to traveler safety, data protection, and transparent partnerships.',
    sections: [
      {
        title: 'Trusted Partners',
        body: 'We only work with airlines, hotels, and activity providers that meet strict safety standards. Every listing is verified before it appears in the product.',
      },
      {
        title: 'Data Security',
        body: 'Travelio uses industry-standard encryption, frequent audits, and continuous monitoring to keep your information safe.',
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro: 'Designing for everyone is non-negotiable. Travelio follows WCAG guidelines and works continuously with external auditors.',
    sections: [
      {
        title: 'Product Experience',
        body: 'Keyboard navigation, screen-reader support, and motion-safe preferences are built into every page.',
        bullets: ['High-contrast color modes', 'Reduced motion settings', 'ARIA labels throughout the interface'],
      },
      {
        title: 'Feedback',
        body: 'If you encounter an accessibility barrier, email access@travelio.com. We review every report within 48 hours.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'Please read these terms carefully before using Travelio. By accessing the site you agree to the following conditions.',
    sections: [
      {
        title: 'Use of Service',
        body: 'Travelio provides travel inspiration and planning tools. Some bookings may redirect you to partner sites subject to their own terms.',
      },
      {
        title: 'User Responsibilities',
        body: 'You agree to use Travelio lawfully, respect intellectual property, and provide accurate information when creating an account or booking travel.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'We take privacy seriously. This policy explains what data we collect, how we use it, and the controls you have.',
    sections: [
      {
        title: 'Data We Collect',
        body: 'Account details, saved trips, devices, and interactions with Travelio features. We never sell your data.',
      },
      {
        title: 'Your Choices',
        body: 'Download or delete your data anytime from account settings. Manage marketing preferences and cookies with a single click.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'Cookies help personalize your experience. Here is what we store and how to opt out.',
    sections: [
      {
        title: 'Necessary Cookies',
        body: 'Required for core functionality like session management and security.',
      },
      {
        title: 'Analytics & Personalization',
        body: 'Anonymous data that helps us improve recommendations. You can disable non-essential cookies from settings.',
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    intro: 'Travelio aggregates information from airlines, hotels, and third parties. We strive for accuracy but cannot guarantee availability or pricing until checkout.',
    sections: [
      {
        title: 'Content Accuracy',
        body: 'Destination content is updated regularly but may change without notice. Always confirm directly with providers before traveling.',
      },
      {
        title: 'Third-Party Links',
        body: 'External links are provided for convenience. Travelio is not responsible for the content or policies of linked sites.',
      },
    ],
  },
}

function App() {
  const { destinations, loading: destinationsLoading, refetch: refetchDestinations } = useDestinations()
  
  // Initialize page from URL hash, default to 'home'
  const getPageFromHash = (): Page => {
    const hash = window.location.hash.slice(1) // Remove the '#'
    const validPages: Page[] = [
      'home',
      'news',
      'destinations',
      'contact',
      'search',
      'flights',
      'booking',
      'payment',
      'confirmation',
      'admin',
      ...Object.keys(staticPages) as StaticPage[],
    ]
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

  const handleFlightSelect = () => {
    window.open('https://www.ryanair.com/', '_blank')
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
          <div className="min-h-screen bg-slate-950 text-white pt-28 sm:pt-32">
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
          </div>
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
          <>
            <div className="min-h-screen bg-slate-950 pt-28 sm:pt-32 pb-12 sm:pb-16 md:pb-20">
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
            <Footer />
          </>
        )

      case 'booking':
        return (
          <div className="min-h-screen bg-slate-950 pt-28 sm:pt-32 pb-12 sm:pb-16 md:pb-20">
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
          <div className="min-h-screen bg-slate-950 pt-28 sm:pt-32 pb-12 sm:pb-16 md:pb-20">
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
          <div className="min-h-screen bg-slate-950 pt-28 sm:pt-32 pb-12 sm:pb-16 md:pb-20">
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
        if (currentPage in staticPages) {
          const content = staticPages[currentPage as StaticPage]
          return <SimpleContentPage {...content} />
        }
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
            currentPage === 'admin' ? 'admin' : 'home'
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
