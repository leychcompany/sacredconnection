"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { StoreProduct } from "@/lib/woo/types";
import { formatStorePrice } from "@/lib/woo/types";

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});

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

  const price = formatStorePrice(
    product.prices.price,
    product.prices.currency_minor_unit,
    product.prices.currency_code
  );

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
          label="Add to Cart — Begin Your Ceremony"
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
