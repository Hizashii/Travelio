import { useState } from 'react'
import { motion } from 'motion/react'
import { useCurrency, currencies } from '../contexts/CurrencyContext'

export default function Footer() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-center">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
            <span>Currency</span>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-white"
              >
                <span>{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.code}</span>
                <span className="text-[11px] text-slate-400">({selectedCurrency.name})</span>
                <motion.svg
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3.5 h-3.5 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[260px] max-h-[320px] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-xl z-20"
                  >
                    <div className="p-2">
                      {currencies.map((currency) => (
                        <motion.button
                          key={currency.code}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCurrency(currency)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                            selectedCurrency.code === currency.code
                              ? 'bg-sky-500/20 text-sky-200'
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 justify-items-center">
            <div>
              <h4 className="font-semibold mb-3 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#safety" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Travelio. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

