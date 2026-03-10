# RightPrice AI Coding Instructions

## Project Overview

**RightPrice** is a Next.js 16 real estate pricing application for Bangalore properties. The app estimates property resale prices and matches buyers with sellers through a Supabase backend.

**Architecture**: Client-side React components (Next.js App Router) + Supabase PostgreSQL database

## Directory Structure

```
app/
  page.js              # Seller listing flow (main entry point /)
  buying/page.js       # Buyer search flow (/buying)
  supabase.js          # Supabase client singleton
  layout.js            # Root layout with Geist fonts
  globals.css          # Tailwind global styles
```

## Key Patterns & Conventions

### 1. Client Components
- Both pages use `"use client"` directive (React 19)
- Use React hooks for state: `useState` for form fields, calculations, and UI visibility
- Common state pattern: area, size (sqft), age (years), price, demand, queue, showForm, phone

### 2. Price Calculation Algorithm
Located in `app/page.js` and `app/buying/page.js` `calculatePrice()` function:
```javascript
// Base rate per sqft: ₹8000
// Age-based discount: 5% (5-10yr), 8% (10-15yr), 12% (15yr+)
// Price band: adjusted price ± 7%
// Simulated demand: "20 buyers searching in {area}"
// Queue position: from Sellers table count + 1
```

### 3. Supabase Integration
- **Client instantiated**: `app/supabase.js` exports singleton via `createClient()`
- **Tables referenced**: `Sellers`, `Listings`
- **Query patterns**: `.select("*")`, `.eq("area", area)`, `.insert([])`
- **Error handling**: Basic try/catch with alerts; production needs improvement
- **Key areas**: Whitefield, Sarjapura, HSR Layout, Indiranagar, Electronic City, Basavanagudi, Jayanagar, Yelahanka, BTM Layout, Hebbal

### 4. Styling & UI
- **Framework**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Layout**: Centered cards (max-w-md) with shadow-lg
- **Color scheme**: Green buttons (actions), blue (listings), orange (demand), gray backgrounds
- **Icons/Emojis**: 🔥 (demand), ⚡ (queue), 📞 (list property)

### 5. Form Workflow Differences

**Seller (/) vs Buyer (/buying) pages differ in UI structure:**
- **Seller**: Form always visible; list button toggles phone form after price calculation
- **Buyer**: Same pricing logic but UI may be used for browsing only (check buying/page.js variations)

## Development Workflow

### Build & Run
```bash
npm run dev       # Start Next.js dev server on localhost:3000
npm run build     # Production build
npm start         # Run production build
npm run lint      # Run ESLint (configured for next/core-web-vitals)
```

### Database Setup
- Supabase project credentials in `app/supabase.js` (publishable key exposed—use environment variables for production)
- Tables must have columns: `area (text)`, `size (int)`, `age (int)`, `phone (text)`

### Linting
- ESLint v9 with `eslint-config-next`
- Command: `npm run lint` (no auto-fix configured)

## Common Tasks for AI Agents

### Adding a New Area
1. Update `areas` array in both `app/page.js` and `app/buying/page.js`
2. Ensure Supabase has listings in that area

### Modifying Price Calculation
- Edit `calculatePrice()` in target page
- Update base rate (`baseRate = 8000`), age thresholds, or band % (currently ±7%)
- Test with sample inputs

### Database Queries
- All use `supabase` client from `app/supabase.js`
- Chain methods: `.from("table").select().eq().insert().then()`
- Handle errors: check `const { error }` or `.catch()`

### UI Changes
- Use Tailwind classes (v4 syntax)
- Keep responsive: `max-w-md` for small screens, `space-y-4` for vertical rhythm
- Test on both routes (/ and /buying)

## Critical Notes for Agents

1. **Security**: Supabase publishable key is exposed in source. Production deployment requires `.env.local` and environment-based configuration.
2. **Error Handling**: Currently uses basic `alert()`. Improve with toast notifications or error boundaries.
3. **Data Validation**: Phone field lacks format validation (should validate 10-digit Indian numbers).
4. **Performance**: No loading states during async database operations. Consider adding spinners/disabled buttons.
5. **Hardcoded Data**: Buyer count (20) and base rate (8000) are hardcoded; consider making configurable.
6. **Navigation**: Simple Link-based nav bar—no active route highlighting.

## Testing Endpoints

- **Seller flow**: http://localhost:3000 → Calculate price → List property
- **Buyer flow**: http://localhost:3000/buying → Calculate price
- **Database**: Check Supabase dashboard (Sellers & Listings tables) after submissions

---

*Last Updated: 2026-03-08 | Framework: Next.js 16, React 19, Tailwind CSS 4, Supabase 2.98*
