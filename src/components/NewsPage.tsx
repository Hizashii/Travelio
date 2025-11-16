import { motion } from 'motion/react'

type Article = {
  id: number
  title: string
  category: string
  date: string
  readTime: string
  image: string
  excerpt: string
  featured?: boolean
}

const articles: Article[] = [
  {
    id: 1,
    title: '48 Hours in Tokyo: A Neon City Guide',
    category: 'Asia',
    date: 'March 12, 2026',
    readTime: '6 min read',
    image: '/Tokyo.jpg',
    excerpt:
      'From sunrise at Senso-ji to cocktails in Shinjuku, here is how to make the most of a two-day layover in Tokyo.',
    featured: true,
  },
  {
    id: 2,
    title: 'Kerala Backwaters: Slow Travel by Houseboat',
    category: 'India',
    date: 'February 28, 2026',
    readTime: '5 min read',
    image: '/india.jpg',
    excerpt:
      'Glide past palm-fringed canals, tiny villages and emerald-green rice paddies on one of India\'s most peaceful routes.',
  },
  {
    id: 3,
    title: 'Island Hopping in Nusa Penida',
    category: 'Indonesia',
    date: 'February 10, 2026',
    readTime: '4 min read',
    image: '/bali.jpg',
    excerpt:
      'Dramatic cliffs, hidden beaches and some of the clearest water in Bali – here\'s where to go and when.',
  },
  {
    id: 4,
    title: 'Five Italian Coastal Towns You\'ve Never Heard Of',
    category: 'Italy',
    date: 'January 18, 2026',
    readTime: '7 min read',
    image: '/italy.jpg',
    excerpt:
      'Beyond Cinque Terre: discover quiet harbours, pastel facades and local seafood away from the crowds.',
  },
]

export default function NewsPage() {
  const featured = articles.find((a) => a.featured)
  const others = articles.filter((a) => !a.featured)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:px-8 md:py-14">
        {/* Section header */}
        <header className="mb-8 sm:mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Travel news & stories
            </p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Latest from around the world
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm md:text-base text-slate-300">
              City guides, hidden gems and smart tips from our travel editors – updated regularly so you always know where to go next.
            </p>
          </div>

          {/* Simple filter pills (non-functional UI, just style) */}
          <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs md:text-sm">
            {['All', 'Asia', 'Europe', 'Tips'].map((tag, i) => (
              <button
                key={tag}
                className={`rounded-full border px-2.5 sm:px-3 py-1 transition ${
                  i === 0
                    ? 'border-sky-400 bg-sky-500/10 text-sky-100'
                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-sky-500/70'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </header>

        {/* Featured + list layout */}
        <div className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          {/* Featured article */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 shadow-2xl backdrop-blur"
            >
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 w-full overflow-hidden">
                <motion.img
                  src={featured.image}
                  alt={featured.title}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute left-6 right-6 bottom-6 space-y-3">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]">
                    Featured destination
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200/90">
                    <span>{featured.category}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{featured.date}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-semibold md:text-3xl">{featured.title}</h2>
                </div>
              </div>

              <div className="space-y-4 px-6 pb-6 pt-5 md:px-7 md:pb-7">
                <p className="text-sm text-slate-200 md:text-base">{featured.excerpt}</p>

                <button className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200">
                  Read full story
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/15">
                    →
                  </span>
                </button>
              </div>
            </motion.article>
          )}

          {/* Other articles */}
          <section className="space-y-4 md:space-y-5">
            {others.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 p-3 shadow-lg backdrop-blur-md hover:border-sky-500/60"
              >
                <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-xl md:h-24 md:w-32">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="uppercase tracking-[0.2em]">{article.category}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <span>{article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-sm font-semibold md:text-base">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-300 md:text-sm">
                      {article.excerpt}
                    </p>
                  </div>

                  <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-sky-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read more →
                  </button>
                </div>
              </motion.article>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

