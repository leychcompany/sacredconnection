"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { StoreProduct } from "@/lib/woo/types";
import { formatStorePrice } from "@/lib/woo/types";
import {
  SUBSCRIPTION_DISCOUNT,
  SUBSCRIPTION_FREQUENCIES,
  type SubscriptionFrequency,
} from "@/lib/subscription";

type PurchaseType = "one-time" | "subscribe";

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("one-time");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");

  const attrOptions = useMemo(
    () =>
      product.attributes.filter(
        (a) => a.has_variations && a.terms && a.terms.length > 0
      ),
    [product.attributes]
  );

  const matchedVariation = useMemo(() => {
    if (product.type !== "variable" || product.variations.length === 0) {
      return null;
    }
    const keys = Object.keys(selected);
    if (keys.length < attrOptions.length) return null;
    return (
      product.variations.find((v) =>
        v.attributes.every(
          (a) => selected[a.name.toLowerCase()] === a.value.toLowerCase()
        )
      ) || null
    );
  }, [product, selected, attrOptions.length]);

  const purchasableId =
    product.type === "variable"
      ? matchedVariation?.id
      : product.is_purchasable
        ? product.id
        : undefined;

  const variationPayload =
    product.type === "variable"
      ? Object.entries(selected).map(([attribute, value]) => ({
          attribute,
          value,
        }))
      : undefined;

  const minorUnit = product.prices.currency_minor_unit;
  const currency = product.prices.currency_code;
  const priceValue = parseInt(product.prices.price, 10) || 0;

  const price = formatStorePrice(priceValue, minorUnit, currency);
  const subscriptionPrice = formatStorePrice(
    Math.round(priceValue * (1 - SUBSCRIPTION_DISCOUNT)),
    minorUnit,
    currency
  );

  const variationLabel = variationPayload?.length
    ? variationPayload.map((v) => v.value).join(", ")
    : undefined;

  const isSubscribe = purchaseType === "subscribe";

  return (
    <div>
      <div className="mb-6 font-[family-name:var(--serif)] text-[34px] font-medium">
        {product.type === "variable" && !matchedVariation ? `From ${price}` : price}
      </div>

      {attrOptions.map((attr) => (
        <div key={attr.id} className="mb-5">
          <label className="mb-2 block text-sm font-semibold">{attr.name}</label>
          <div className="flex flex-wrap gap-2">
            {attr.terms.map((term) => {
              const active =
                selected[attr.name.toLowerCase()] === term.name.toLowerCase();
              return (
                <button
                  key={term.id}
                  type="button"
                  onClick={() =>
                    setSelected((s) => ({
                      ...s,
                      [attr.name.toLowerCase()]: term.name.toLowerCase(),
                    }))
                  }
                  className={`rounded-[2px] border px-4 py-2 text-sm ${
                    active
                      ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                      : "border-[var(--line)] bg-white"
                  }`}
                >
                  {term.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <fieldset className="mb-6">
        <legend className="mb-3 block text-sm font-semibold">
          How would you like to receive it?
        </legend>
        <div className="grid gap-3">
          <PurchaseOption
            active={!isSubscribe}
            onSelect={() => setPurchaseType("one-time")}
            title="One-time purchase"
            price={price}
            description="A single delivery. No commitment."
          />
          <PurchaseOption
            active={isSubscribe}
            onSelect={() => setPurchaseType("subscribe")}
            title="Subscribe & Save"
            price={`${subscriptionPrice} / delivery`}
            strikethrough={price}
            badge={`Save ${Math.round(SUBSCRIPTION_DISCOUNT * 100)}%`}
            description="Never run out of medicine. Skip, pause, or cancel anytime."
          >
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-semibold">
                Delivery rhythm
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value as SubscriptionFrequency)
                  }
                  className="mt-2 w-full rounded-[2px] border border-[var(--line)] bg-white px-3 py-2 font-normal"
                >
                  {SUBSCRIPTION_FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <ul className="space-y-1.5 text-[13px] text-[rgba(22,19,16,.7)]">
                <li className="flex gap-2">
                  <span className="text-[var(--clay)]">✓</span>
                  {Math.round(SUBSCRIPTION_DISCOUNT * 100)}% off every recurring
                  delivery
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--clay)]">✓</span>
                  Priority dispatch, fresh from each harvest
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--clay)]">✓</span>
                  Skip, pause, or cancel anytime — no lock-in
                </li>
              </ul>
              <p className="text-[12px] leading-relaxed text-[rgba(22,19,16,.5)]">
                Your first delivery is placed today. Our keepers set up your
                recurring deliveries and apply your{" "}
                {Math.round(SUBSCRIPTION_DISCOUNT * 100)}% ritual discount to
                each one.
              </p>
            </div>
          </PurchaseOption>
        </div>
      </fieldset>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-semibold">
          Qty
        </label>
        <div className="flex items-center border border-[var(--line)] bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="h-[48px] w-11"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 border-0 text-center font-semibold outline-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            className="h-[48px] w-11"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      {purchasableId ? (
        <AddToCartButton
          productId={purchasableId}
          quantity={qty}
          variation={variationPayload}
          subscription={
            isSubscribe
              ? {
                  productId: purchasableId,
                  name: product.name,
                  frequency,
                  quantity: qty,
                  variation: variationLabel,
                }
              : undefined
          }
          label={
            isSubscribe
              ? "Subscribe & Save — Begin Your Ritual"
              : "Add to Cart — Begin Your Ceremony"
          }
          className="btn btn-clay w-full sm:w-auto"
        />
      ) : (
        <button type="button" className="btn btn-clay" disabled>
          {product.type === "variable"
            ? "Select options"
            : "Currently unavailable"}
        </button>
      )}
    </div>
  );
}

function PurchaseOption({
  active,
  onSelect,
  title,
  price,
  strikethrough,
  badge,
  description,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  title: string;
  price: string;
  strikethrough?: string;
  badge?: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[4px] border transition-colors ${
        active
          ? "border-[var(--ink)] bg-[var(--sand)]"
          : "border-[var(--line)] bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border ${
            active
              ? "border-[var(--ink)] bg-[var(--ink)]"
              : "border-[var(--line)] bg-white"
          }`}
        >
          {active && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{title}</span>
            {badge && (
              <span className="rounded-full bg-[var(--clay)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-1 flex items-baseline gap-2">
            <span className="font-[family-name:var(--serif)] text-lg">
              {price}
            </span>
            {strikethrough && (
              <span className="text-sm text-[rgba(22,19,16,.4)] line-through">
                {strikethrough}
              </span>
            )}
          </span>
          <span className="mt-1 block text-[13px] text-[rgba(22,19,16,.6)]">
            {description}
          </span>
        </span>
      </button>
      {active && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
