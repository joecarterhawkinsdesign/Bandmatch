# BandMatch

BandMatch is a Tinder-style Next.js app for musicians to discover bandmates by swiping left/right on profiles.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env vars:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Supabase values to `.env.local`.

4. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.

5. Start dev server:

   ```bash
   npm run dev
   ```

## Features

- Email magic link auth with Supabase
- Swipeable profile deck (drag or buttons)
- Match creation when two users swipe right
- Matches page with contact details
