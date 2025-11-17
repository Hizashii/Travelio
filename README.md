# Travel Portfolio

A modern travel portfolio built with React, Vite, Tailwind CSS v4, shadcn/ui, GSAP, and Lenis.

## Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **GSAP + ScrollTrigger** - Animation library with scroll-based animations
- **Lenis** - Smooth scrolling library
- **GSAP with React Hooks** - GSAP works seamlessly with React hooks (react-gsap is not compatible with React 18, but GSAP's hooks-based approach is recommended)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Supabase Configuration

- Create a `.env` in the project root and define at least:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_STORAGE_BUCKET` (defaults to `destination-images` if omitted)
- Run the SQL in `supabase_setup.sql` to create the `destinations` table and in `supabase_admin_setup.sql` for admin accounts.
- Create a Supabase Storage bucket (e.g., `destination-images`), mark it as **public**, and grant `storage.objects` insert/read policies for your service role.
- The admin dashboard can now upload images directly from the browser; uploaded files are stored in the bucket and their public URLs are saved to the `destinations` table automatically.

## Bulk destination uploader

Need to add all the destinations from `public/bulk` at once? Use the helper script:

1. Place the JPGs you want to upload inside `public/bulk/` (already populated with European cities).
2. Set the required environment variables (service-role key must stay out of version control):
   ```powershell
   set VITE_SUPABASE_URL=your-project-url
   set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   set VITE_SUPABASE_STORAGE_BUCKET=image
   ```
3. Run the uploader:
   ```bash
   node scripts/bulkUploadDestinations.mjs
   ```

The script uploads each file to `storage://<bucket>/destinations/...`, obtains the public URL, and upserts the destination row in Supabase. Edit `scripts/bulkUploadDestinations.mjs` if you need to tweak descriptions, base prices, or the list of files.

## Adding shadcn/ui Components

To add shadcn/ui components, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## GSAP + ScrollTrigger Usage

GSAP and ScrollTrigger are already set up and registered. You can use them in your components with React hooks:

```tsx
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
        opacity: 0,
        y: 50,
      })
    })

    return () => ctx.revert() // Cleanup
  }, [])

  return <div ref={ref}>Animated content</div>
}
```

**Note:** `react-gsap` is not compatible with React 18. GSAP works excellently with React hooks directly, and using `gsap.context()` for cleanup is the recommended approach.

## Lenis Smooth Scrolling

Lenis is initialized in `App.tsx` and integrated with GSAP ScrollTrigger for smooth, accessible scrolling.

