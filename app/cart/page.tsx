"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";

export default function CartPage() {
  const { cart, loading, refreshing, updateItem, removeItem } = useCart();

  if (loading) {
    return (
      <div className="wrap py-24 text-center text-[rgba(22,19,16,.55)]">
        Loading your cart…
      </div>
    );
  }

  const items = cart?.items ?? [];
  const totals = cart?.totals;

  return (
    <div className="py-16 md:py-24">
      <div className="wrap">
        <h1 className="mb-10 font-[family-name:var(--serif)] text-[clamp(32px,4vw,44px)] font-normal">
          Your cart
        </h1>

        {items.length === 0 ? (
          <div className="rounded-[4px] border border-[var(--line)] bg-white px-8 py-16 text-center">
            <p className="mb-6 text-[rgba(22,19,16,.65)]">Your cart is empty.</p>
            <Link href="/shop" className="btn btn-clay">
              Explore the Medicine
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_.8fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-4 rounded-[4px] border border-[var(--line)] bg-white p-5 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-[var(--sand)]">
                    {item.images[0] && (
                      <Image
                        src={item.images[0].thumbnail || item.images[0].src}
                        alt={stripHtml(item.name)}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={item.permalink.replace(
                        /^https?:\/\/[^/]+/,
                        ""
                      ).includes("/product/")
                        ? `/product/${item.permalink.split("/").filter(Boolean).pop()}`
                        : `/product/${item.id}`}
                      className="font-[family-name:var(--serif)] text-lg font-medium"
                    >
                      {stripHtml(item.name)}
                    </Link>
                    {item.variation.length > 0 && (
                      <p className="mt-1 text-sm text-[#5c554d]">
                        {item.variation
                          .map((v) => `${v.attribute}: ${v.value}`)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="mt-2 font-semibold">
                      {formatStorePrice(
                        item.totals.line_total,
                        item.totals.currency_minor_unit,
                        item.totals.currency_code
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[var(--line)]">
                      <button
                        type="button"
                        className="h-10 w-10"
                        disabled={refreshing}
                        onClick={() =>
                          updateItem(item.key, Math.max(1, item.quantity - 1))
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-10 w-10"
                        disabled={refreshing}
                        onClick={() => updateItem(item.key, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-[var(--clay)]"
                      disabled={refreshing}
                      onClick={() => removeItem(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[4px] border border-[var(--line)] bg-[var(--bone)] p-7">
              <h2 className="mb-5 font-[family-name:var(--serif)] text-2xl">
                Order summary
              </h2>
              {totals && (
                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatStorePrice(
                        totals.total_items,
                        totals.currency_minor_unit,
                        totals.currency_code
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--line)] pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>
                      {formatStorePrice(
                        totals.total_price,
                        totals.currency_minor_unit,
                        totals.currency_code
                      )}
                    </span>
                  </div>
                </div>
              )}
              <Link href="/checkout" className="btn btn-clay w-full">
                Proceed to Checkout
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-sm text-[var(--clay)]"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
