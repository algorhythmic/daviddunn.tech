# David Dunn's Personal Website

My personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 🌓 Dark/light mode support
- 📱 Mobile-first approach
- 📝 Blog section
- 📸 Photo gallery
- 🛠 Projects/Apps showcase
- 🔒 Authentication support

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI & shadcn/ui
- **Database:** MongoDB & Supabase
- **Authentication:** NextAuth.js
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/algorhythmic/daviddunn.tech.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
daviddunn.tech/
├── public/           # Static files
├── src/
│   ├── app/         # App router pages
│   ├── components/  # React components
│   ├── lib/         # Utility functions
│   ├── types/       # TypeScript types
│   └── styles/      # Global styles
├── .env.local       # Local environment variables
└── package.json     # Project dependencies
```

## License

MIT © David Dunn
