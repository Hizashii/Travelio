import { motion } from 'motion/react'

interface Section {
  title: string
  body: string
  bullets?: string[]
}

interface SimpleContentPageProps {
  title: string
  intro: string
  sections: Section[]
}

export default function SimpleContentPage({ title, intro, sections }: SimpleContentPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Travelio</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {intro}
          </p>
        </motion.div>

        <div className="space-y-8 sm:space-y-10">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 sm:p-7 lg:p-8 shadow-lg"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {section.body}
              </p>
              {section.bullets && (
                <ul className="mt-4 space-y-2 text-sm text-slate-300 list-disc pl-5">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}


