# Headless WooCommerce setup (WordPress admin)

Complete these steps on **sacred-snuff.com** so the Next.js storefront can create real WooCommerce orders.

## 1. CORS mu-plugin

1. Copy [`wordpress/mu-plugins/sacred-headless-cors.php`](wordpress/mu-plugins/sacred-headless-cors.php) to:
   `wp-content/mu-plugins/sacred-headless-cors.php`
2. Edit the allowed origins list to include your Vercel URL and eventual custom domain.
3. Confirm Store API still returns `200` from the browser network panel when the Next app calls it.

## 2. REST API keys (order confirmation page)

1. WooCommerce → Settings → Advanced → REST API → Add key
2. Permissions: **Read**
3. Copy Consumer Key / Secret into Vercel env:
   - `WC_CONSUMER_KEY`
   - `WC_CONSUMER_SECRET`

## 3. Stripe (recommended for headless checkout)

1. Enable Stripe in WooCommerce → Settings → Payments
2. Prefer Stripe over Square for headless Store API checkout
3. Square can remain enabled for the legacy WordPress checkout during transition

## 4. Product revalidation webhook

1. WooCommerce → Settings → Advanced → Webhooks → Add webhook
2. Topic: Product created **and** Product updated (or separate webhooks)
3. Delivery URL:
   `https://YOUR_VERCEL_DOMAIN/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
4. Set the same secret in Vercel as `REVALIDATE_SECRET`

## 5. Verify

1. Add a product to cart on the Next site
2. Complete checkout
3. Confirm the order appears under **WooCommerce → Orders** with stock reduced and notification emails sent

## Env vars (Vercel / `.env.local`)

```
NEXT_PUBLIC_WC_STORE_URL=https://sacred-snuff.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
REVALIDATE_SECRET=long-random-string
```
