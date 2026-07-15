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

## 3. Payments (headless Store API)

Currently exposed gateways on the live Store API: **`authnet`** (Authorize.net) and **`zelle`**.

- **Zelle** works for headless checkout today (creates an on-hold WooCommerce order).
- **Authorize.net** may need additional payment-data fields for card entry in a later iteration.
- **Stripe** is still the nicest headless card option if you enable it in WooCommerce → Settings → Payments; Square is a poor fit for Store API checkout.

The Next.js checkout uses whatever `payment_methods` the Store API returns on the cart.

## 4. Product revalidation webhook

1. WooCommerce → Settings → Advanced → Webhooks → Add webhook
2. Topic: Product created **and** Product updated (or separate webhooks)
3. Delivery URL:
   `https://YOUR_VERCEL_DOMAIN/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
4. Set the same secret in Vercel as `REVALIDATE_SECRET`

## 5. LiteSpeed / page cache (critical)

LiteSpeed Cache on sacred-snuff.com was observed caching `GET /wp-json/wc/store/v1/cart` as **public for 7 days** and **not varying on the `Cart-Token` header**. That causes every shopper to share one ghost empty cart.

Do one of the following in LiteSpeed Cache (or equivalent CDN):

1. **Exclude** from cache:
   - `/wp-json/wc/store/*`
   - `/wp-json/wc/store/v1/cart*`
   - `/wp-json/wc/store/v1/checkout*`
2. Or force those REST routes to `no-cache` / private and vary by `Cart-Token`.

The Next.js client already cache-busts cart/checkout URLs as a workaround, but excluding Store API from LiteSpeed is the correct fix.

## 6. Verify

1. Add a product to cart on the Next site
2. Reload `/cart` — the item must still be there
3. Complete checkout
4. Confirm the order appears under **WooCommerce → Orders** with stock reduced and notification emails sent

## Env vars (Vercel / `.env.local`)

```
NEXT_PUBLIC_WC_STORE_URL=https://sacred-snuff.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
REVALIDATE_SECRET=long-random-string
```
