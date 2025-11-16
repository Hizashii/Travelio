import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'How do I search for flights?',
    answer: 'Simply enter your departure and destination cities, select your travel dates, choose the number of passengers, and click Search. Our system will find the best available flights for you.',
  },
  {
    question: 'Can I book a round-trip flight?',
    answer: 'Yes! You can choose between one-way and round-trip flights. Select "Return" for round-trip and enter both your departure and return dates.',
  },
  {
    question: 'What is dynamic pricing?',
    answer: 'Our prices change based on how close your departure date is. Booking early (60+ days) can save you up to 10%, while last-minute bookings (0-3 days) may cost up to 200% more.',
  },
  {
    question: 'How do I modify or cancel my booking?',
    answer: 'You can manage your booking by logging into your account or contacting our customer service team. Cancellation policies vary by airline and fare type.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. All transactions are secured with SSL encryption.',
  },
  {
    question: 'Do you offer travel insurance?',
    answer: 'Yes, we offer comprehensive travel insurance options during the booking process. You can add travel insurance to protect your trip against unexpected events.',
  },
  {
    question: 'How do I check-in for my flight?',
    answer: 'Online check-in opens 24 hours before your departure time. You can check in through our website or the airline\'s mobile app using your booking reference.',
  },
  {
    question: 'What if my flight is delayed or cancelled?',
    answer: 'If your flight is delayed or cancelled, we will notify you immediately via email and SMS. You may be eligible for compensation or rebooking depending on the circumstances and airline policies.',
  },
  {
    question: 'Can I add extra baggage?',
    answer: 'Yes, you can add extra baggage during the booking process or later through your booking management page. Additional fees apply based on weight and destination.',
  },
  {
    question: 'Do you have a mobile app?',
    answer: 'Yes, our mobile app is available for both iOS and Android devices. Download it to search, book, and manage your flights on the go.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">Frequently Asked Questions</h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-300">
            Find answers to common questions about booking flights with us
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="border border-white/10 rounded-lg overflow-hidden bg-slate-900/70"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold pr-4 sm:pr-6 md:pr-8 text-white">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-300 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

