"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { addSubscription, type SubscriptionIntent } from "@/lib/subscription";

export function AddToCartButton({
  productId,
  quantity = 1,
  variation,
  label = "Add to Cart",
  className = "btn btn-clay",
  subscription,
  onAdded,
}: {
  productId: number;
  quantity?: number;
  variation?: Array<{ attribute: string; value: string }>;
  label?: string;
  className?: string;
  subscription?: SubscriptionIntent;
  onAdded?: () => void;
}) {
  const { addItem, refreshing } = useCart();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    try {
      await addItem(productId, quantity, variation);
      if (subscription) {
        addSubscription({ ...subscription, quantity });
      }
      setDone(true);
      onAdded?.();
      setTimeout(() => setDone(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add to cart");
    }
  }

  return (
    <div>
      <button
        type="button"
        className={className}
        disabled={refreshing}
        onClick={handleClick}
      >
        {done ? "Added ✓" : refreshing ? "Adding…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-[var(--clay)]">{error}</p>}
    </div>
  );
}
