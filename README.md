# NOIRÉ — Luxury Fragrance Storefront

An art-directed, fully shoppable e-commerce front end for a **fictional** luxury fragrance house. Built with Next.js (App Router), TypeScript and GSAP, designed to feel like an international perfume campaign rather than a template store.

**Live demo:** https://usman552.github.io/noire-fragrance/

> NOIRÉ is a made-up brand and this is a design/engineering prototype. Checkout is a demonstration: **no payment is taken and no order is sent anywhere.**

## Highlights

- **Editorial design system** — "The hour after": ivory stone by day, espresso at dusk, obsidian after dark. Bodoni Moda display type paired with Inter Tight.
- **Real photography** — 21 licensed photographs, centrally mapped so any image can be swapped in one place.
- **Complete shopping flow** — product pages, size selection, quantity controls, cart drawer, checkout with validation, demo order confirmation.
- **Restrained motion** — GSAP + ScrollTrigger for image reveals, headline reveals and light parallax. No scroll hijacking, no intro screen.
- **Accessible by default** — skip link, focus-trapped cart drawer, live-region cart announcements, keyboard-reachable content, `prefers-reduced-motion` support.
- **Responsive** — separate mobile compositions (not shrunk desktop layouts), no horizontal overflow.

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero, fragrance introduction, notes, campaign scene, collection, brand story, closing |
| `/fragrances/[slug]` | Product detail (statically generated for each fragrance) |
| `/checkout` | Contact, delivery and demo payment form with validation and live order summary |
| `/checkout/confirmation` | Demo order receipt |
| `/credits` | Photography credits |

## Tech stack

- **Framework:** Next.js 16 (App Router, static generation), React 19
- **Language:** TypeScript (strict)
- **Animation:** GSAP 3 + ScrollTrigger (via `gsap.matchMedia`, so animations rebuild on resize)
- **Styling:** CSS Modules + a small global design system (`app/globals.css`)
- **Icons:** lucide-react
- **Images:** `next/image` with static imports (no layout shift, blur placeholders)
- **Tests:** Node's built-in test runner for cart, pricing, validation and order logic
- **CI/CD:** GitHub Actions → GitHub Pages

## Getting started

Requirements: **Node.js ≥ 22.6** and npm.

```bash
git clone https://github.com/Usman552/noire-fragrance.git
cd noire-fragrance
npm install
npm run dev          # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (cart, totals, validation, receipts, catalogue integrity) |

### Building for GitHub Pages locally

```bash
GITHUB_PAGES=true npm run build     # static export to ./out under /noire-fragrance
```

On Windows PowerShell: `$env:GITHUB_PAGES="true"; npm run build`.

## Shopping features

- Add to bag from the home page, collection and product pages
- Size selection (50 ml / 100 ml) with per-size pricing
- Quantity steppers (1–10) and remove, in the cart drawer and at checkout
- Subtotal, delivery (free over PKR 25,000, otherwise PKR 350) and total
- Cart persisted in `localStorage` (versioned, sanitised, synced across tabs)
- Checkout validation: name, Pakistani mobile number (normalised to `+92…`), address and city
- Demo order service with a confirmation receipt

## Project structure

```
app/                      Routes (App Router)
  page.tsx                Home — composes the sections
  fragrances/[slug]/      Product detail (SSG)
  checkout/, credits/
components/
  home/                   Hero, Introduction, Notes, Campaign, Collection, BrandStory, Closing
  product/  checkout/  layout/  ui/
lib/
  products.ts             Catalogue — single source of truth
  assets.ts               Photography registry (files, alt text, focal points, credits)
  cart/                   Pure reducer + totals, localStorage adapter, React provider
  checkout/validation.ts  Form rules
  orders/orderService.ts  OrderService interface + demo implementation
  motion.ts               GSAP setup and reveal helpers
public/images/            Photography
tests/                    Unit tests
.github/workflows/        Pages deployment
```

### Design decisions worth knowing

- **Pure cart model.** The cart stores only `{ productId, sizeId, quantity }` and re-prices from the catalogue on every read, so stale storage can never show an outdated price.
- **Swappable backend.** The UI talks to an `OrderService` interface. To go live, implement `submit()` against a real API and payment provider; replace `lib/products.ts` with a fetch returning the same shape.
- **Motion is optional.** All animation is set up through `gsap.matchMedia`; with reduced motion or if set-up fails, content renders static and fully visible.
- **Reveals use opacity only**, so unrevealed content stays keyboard-focusable and in the accessibility tree.

## Photography and licensing

All photographs are from [Unsplash](https://unsplash.com) and used under the [Unsplash License](https://unsplash.com/license). Photographers are credited on the `/credits` page. The bottle photographs are unbranded stock images standing in for the fictional products.

## Known limits

- Prices, delivery policy and copy are placeholders.
- Product photos are stand-ins; a dedicated shoot of one bottle in four colourways would make the collection more cohesive.
