"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Address, Cart } from "@/lib/woo/types";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";

const emptyAddress: Address = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
  email: "",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();
  const [billing, setBilling] = useState<Address>(emptyAddress);
  const [shipping, setShipping] = useState<Address>(emptyAddress);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localCart, setLocalCart] = useState<Cart | null>(null);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    if (cart?.payment_methods?.length) {
      const preferred =
        cart.payment_methods.find((m) => m.includes("stripe")) ||
        cart.payment_methods[0];
      setPaymentMethod(preferred);
    }
  }, [cart?.payment_methods]);

  async function syncCustomer(nextBilling: Address, nextShipping: Address) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-customer",
        billing_address: nextBilling,
        shipping_address: sameAsBilling ? nextBilling : nextShipping,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not update address");
    setLocalCart(data as Cart);
    return data as Cart;
  }

  async function onSelectRate(packageId: number, rateId: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select-shipping",
          package_id: packageId,
          rate_id: rateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Shipping error");
      setLocalCart(data as Cart);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Shipping error");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const ship = sameAsBilling ? billing : shipping;
      await syncCustomer(billing, ship);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkout",
          billing_address: { ...billing, email: billing.email, phone: billing.phone },
          shipping_address: { ...ship, email: billing.email, phone: billing.phone },
          payment_method: paymentMethod,
          customer_note: note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      const orderId = data.order_id as number;
      const paymentStatus = data.payment_result?.payment_status as
        | string
        | undefined;
      const redirect = data.payment_result?.redirect_url as string | undefined;

      // Store API already created the WooCommerce order — confirm on our site.
      if (orderId && (paymentStatus === "success" || paymentStatus === "pending")) {
        router.push(`/order/${orderId}`);
        return;
      }

      if (redirect) {
        window.location.href = redirect;
        return;
      }

      if (orderId) {
        router.push(`/order/${orderId}`);
        return;
      }

      throw new Error("Checkout completed but no order id was returned");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="wrap py-24 text-center text-[rgba(22,19,16,.55)]">
        Preparing checkout…
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="wrap py-24 text-center">
        <p className="mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-clay">
          Shop Hapé
        </Link>
      </div>
    );
  }

  const display = localCart || cart;
  const field =
    (set: (a: Address) => void, addr: Address) =>
    (key: keyof Address) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      set({ ...addr, [key]: e.target.value });

  const bf = field(setBilling, billing);
  const sf = field(setShipping, shipping);

  return (
    <div className="bg-[var(--bone)] py-16 md:py-24">
      <div className="wrap">
        <h1 className="mb-10 font-[family-name:var(--serif)] text-[clamp(32px,4vw,44px)] font-normal">
          Checkout
        </h1>
        <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.3fr_.8fr]">
          <div className="space-y-8">
            <section className="rounded-[4px] border border-[var(--line)] bg-white p-6 md:p-8">
              <h2 className="mb-5 font-[family-name:var(--serif)] text-2xl">
                Contact & billing
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" value={billing.first_name} onChange={bf("first_name")} required />
                <Input label="Last name" value={billing.last_name} onChange={bf("last_name")} required />
                <div className="sm:col-span-2">
                  <Input label="Email" type="email" value={billing.email || ""} onChange={bf("email")} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Phone" value={billing.phone || ""} onChange={bf("phone")} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Address" value={billing.address_1} onChange={bf("address_1")} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Apartment, suite, etc." value={billing.address_2} onChange={bf("address_2")} />
                </div>
                <Input label="City" value={billing.city} onChange={bf("city")} required />
                <Input label="State" value={billing.state} onChange={bf("state")} required />
                <Input label="ZIP" value={billing.postcode} onChange={bf("postcode")} required />
                <Input label="Country" value={billing.country} onChange={bf("country")} required />
              </div>
            </section>

            <section className="rounded-[4px] border border-[var(--line)] bg-white p-6 md:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="font-[family-name:var(--serif)] text-2xl">Shipping</h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                  />
                  Same as billing
                </label>
              </div>
              {!sameAsBilling && (
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <Input label="First name" value={shipping.first_name} onChange={sf("first_name")} required />
                  <Input label="Last name" value={shipping.last_name} onChange={sf("last_name")} required />
                  <div className="sm:col-span-2">
                    <Input label="Address" value={shipping.address_1} onChange={sf("address_1")} required />
                  </div>
                  <Input label="City" value={shipping.city} onChange={sf("city")} required />
                  <Input label="State" value={shipping.state} onChange={sf("state")} required />
                  <Input label="ZIP" value={shipping.postcode} onChange={sf("postcode")} required />
                  <Input label="Country" value={shipping.country} onChange={sf("country")} required />
                </div>
              )}

              {display.shipping_rates?.length > 0 && (
                <div className="space-y-2">
                  <p className="mb-2 text-sm font-semibold">Shipping method</p>
                  {display.shipping_rates.map((pkg) =>
                    pkg.shipping_rates.map((rate) => (
                      <label
                        key={rate.rate_id}
                        className="flex cursor-pointer items-center justify-between gap-4 rounded border border-[var(--line)] px-4 py-3"
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`rate-${pkg.package_id}`}
                            checked={rate.selected}
                            onChange={() => onSelectRate(pkg.package_id, rate.rate_id)}
                          />
                          {rate.name}
                        </span>
                        <span className="font-semibold">
                          {formatStorePrice(
                            rate.price,
                            rate.currency_minor_unit,
                            rate.currency_code
                          )}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </section>

            <section className="rounded-[4px] border border-[var(--line)] bg-white p-6 md:p-8">
              <h2 className="mb-4 font-[family-name:var(--serif)] text-2xl">
                Payment
              </h2>
              <p className="mb-4 text-sm text-[rgba(22,19,16,.65)]">
                Orders are created in WooCommerce. Available gateways from your
                store:
              </p>
              <div className="space-y-2">
                {(display.payment_methods?.length
                  ? display.payment_methods
                  : ["zelle"]
                ).map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-3 rounded border border-[var(--line)] px-4 py-3"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <span>
                      {method === "zelle"
                        ? "Zelle"
                        : method === "authnet"
                          ? "Credit card (Authorize.net)"
                          : method.includes("stripe")
                            ? "Credit card (Stripe)"
                            : method.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
              <label className="mt-5 block text-sm font-semibold">
                Order note
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-[2px] border border-[var(--line)] px-3 py-2 font-normal"
                />
              </label>
            </section>
          </div>

          <aside className="h-fit rounded-[4px] border border-[var(--line)] bg-white p-7">
            <h2 className="mb-5 font-[family-name:var(--serif)] text-2xl">
              Your order
            </h2>
            <ul className="mb-5 space-y-3 border-b border-[var(--line)] pb-5">
              {display.items.map((item) => (
                <li key={item.key} className="flex justify-between gap-4 text-sm">
                  <span>
                    {stripHtml(item.name)} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatStorePrice(
                      item.totals.line_total,
                      item.totals.currency_minor_unit,
                      item.totals.currency_code
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mb-6 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                {formatStorePrice(
                  display.totals.total_price,
                  display.totals.currency_minor_unit,
                  display.totals.currency_code
                )}
              </span>
            </div>
            {error && (
              <p className="mb-4 text-sm text-[var(--clay)]" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-clay w-full" disabled={busy}>
              {busy ? "Placing order…" : "Place order"}
            </button>
            <p className="mt-3 text-xs text-[#5c554d]">
              Your order will appear in WooCommerce admin immediately after
              placement.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <input
        id={id}
        {...props}
        className="mt-1.5 w-full rounded-[2px] border border-[var(--line)] px-3 py-2.5 font-normal"
      />
    </label>
  );
}
