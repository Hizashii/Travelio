import { useState } from 'react'
import { motion } from 'motion/react'
import { useCurrency, currencies } from '../contexts/CurrencyContext'

export default function Footer() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-4 py-8 sm:py-10 md:py-12">
        {/* Currency Dropdown Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-slate-300">Currency:</span>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-input hover:bg-accent transition-colors min-w-[200px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{selectedCurrency.symbol}</span>
                  <span className="text-sm font-semibold">{selectedCurrency.code}</span>
                        <span className="text-xs text-slate-400">({selectedCurrency.name})</span>
                </div>
                <motion.svg
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                        className="w-4 h-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-slate-900 border border-white/10 rounded-lg shadow-lg z-20"
                  >
                    <div className="p-2">
                      {currencies.map((currency) => (
                        <motion.button
                          key={currency.code}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCurrency(currency)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                            selectedCurrency.code === currency.code
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span className="font-bold text-lg">{currency.symbol}</span>
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-semibold">{currency.code}</span>
                            <span className="text-xs text-slate-400">{currency.name}</span>
                          </div>
                          {selectedCurrency.code === currency.code && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Travelio. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

