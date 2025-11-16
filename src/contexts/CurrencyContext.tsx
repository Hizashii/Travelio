import { createContext, useContext, useState, ReactNode } from 'react'

export interface Currency {
  code: string
  name: string
  symbol: string
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
]

// Approximate exchange rates relative to USD (as of 2024)
// In a real app, you'd fetch these from an API
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.1,
  SGD: 1.34,
  HKD: 7.82,
  NZD: 1.66,
  SEK: 10.7,
  NOK: 10.8,
  DKK: 6.87,
  PLN: 4.02,
  MXN: 17.1,
  BRL: 4.95,
  ZAR: 18.6,
  RUB: 92.5,
  KRW: 1320,
  TRY: 32.0,
  THB: 35.8,
  IDR: 15750,
  MYR: 4.68,
  PHP: 55.8,
  AED: 3.67,
  SAR: 3.75,
  ILS: 3.65,
  EGP: 30.9,
}

interface CurrencyContextType {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (priceInUSD: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    // Try to get from localStorage, default to USD
    const saved = localStorage.getItem('selectedCurrency')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const found = currencies.find(c => c.code === parsed.code)
        if (found) return found
      } catch (e) {
        // Invalid saved currency, use default
      }
    }
    return currencies[0] // USD
  })

  const convertPrice = (priceInUSD: number): number => {
    const rate = exchangeRates[selectedCurrency.code] || 1
    return priceInUSD * rate
  }

  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2,
    }).format(convertedPrice)
  }

  const handleSetCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    localStorage.setItem('selectedCurrency', JSON.stringify(currency))
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency: handleSetCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

