# Sacred Connection — Headless Storefront

Next.js (App Router) storefront for ceremonial Hapé. **WooCommerce on sacred-snuff.com** remains the product and order manager; this app is the customer-facing UI in the new Sacred Connection design system.

## Stack

- Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- WooCommerce Store API (`/wp-json/wc/store/v1`) for catalog, cart, checkout
- WooCommerce REST API (`/wc/v3`) for order confirmation (server-only keys)
- Vercel deployment

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## WordPress setup

See [docs/wordpress-setup.md](docs/wordpress-setup.md) for CORS, API keys, Stripe, and webhooks.

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (redesign) |
| `/shop` | Product catalog |
| `/shop/[category]` | Category listing |
| `/product/[slug]` | Product detail + add to cart |
| `/find-your-hape` | Quiz funnel |
| `/cart` | Cart |
| `/checkout` | Headless checkout → creates Woo order |
| `/order/[id]` | Confirmation |

Orders placed here are stored in WooCommerce (not in this app).
