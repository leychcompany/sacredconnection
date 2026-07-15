"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";
import {
  frequencyLabel,
  getSubscriptionForItem,
  readSubscriptions,
  removeSubscriptionByProductId,
  SUBSCRIPTION_DISCOUNT,
  type SubscriptionIntent,
} from "@/lib/subscription";

export default function CartPage() {
  const { cart, loading, refreshing, updateItem, removeItem } = useCart();
  const [subscriptions, setSubscriptions] = useState<SubscriptionIntent[]>([]);

  useEffect(() => {
    const sync = () => setSubscriptions(readSubscriptions());
    sync();
    window.addEventListener("sc-subscriptions-change", sync);
    return () => window.removeEventListener("sc-subscriptions-change", sync);
  }, []);

  if (loading) {
    return (
      <div className="wrap py-24 text-center text-[rgba(22,19,16,.55)]">
        Loading your cart…
      </div>
    );
  }

  const items = cart?.items ?? [];
  const totals = cart?.totals;

  async function handleRemove(key: string, productId: number) {
    await removeItem(key);
    removeSubscriptionByProductId(productId);
  }

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
              {items.map((item) => {
                const subscription = getSubscriptionForItem(
                  subscriptions,
                  item.id
                );
                const isSubscription = Boolean(subscription);
                return (
                  <div
                    key={item.key}
                    className={`overflow-hidden rounded-[4px] border ${
                      isSubscription
                        ? "border-[var(--clay)] bg-[var(--sand)]"
                        : "border-[var(--line)] bg-white"
                    }`}
                  >
                    {isSubscription && subscription && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-[var(--clay)] px-5 py-2 text-white">
                        <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em]">
                          <RepeatIcon />
                          Subscribe &amp; Save
                        </span>
                        <span className="text-[12px] text-white/85">
                          {frequencyLabel(subscription.frequency)} ·{" "}
                          {Math.round(SUBSCRIPTION_DISCOUNT * 100)}% off recurring
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
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
                        {isSubscription && subscription && (
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-[var(--moss)]">
                            <span className="font-semibold text-[var(--clay-dark)]">
                              Delivers {frequencyLabel(subscription.frequency).toLowerCase()}
                            </span>
                            <span className="text-[rgba(22,19,16,.5)]">
                              · first delivery ships with this order
                            </span>
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
                        <div className="flex items-center border border-[var(--line)] bg-white">
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
                          onClick={() => handleRemove(item.key, item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

function RepeatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}
