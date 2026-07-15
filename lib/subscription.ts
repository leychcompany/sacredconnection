"use client";

// The live WooCommerce backend does not have the WooCommerce Subscriptions
// plugin (only simple/variable products). "Subscribe & Save" is captured here
// on the storefront and carried into the WooCommerce order note at checkout so
// staff can set up recurring fulfillment. Keep this in sync with any future
// server-side subscription support.

export const SUBSCRIPTION_DISCOUNT = 0.1; // 10% off recurring deliveries

export type SubscriptionFrequency =
  | "2-weeks"
  | "monthly"
  | "2-months"
  | "3-months";

export const SUBSCRIPTION_FREQUENCIES: Array<{
  value: SubscriptionFrequency;
  label: string;
  short: string;
}> = [
  { value: "2-weeks", label: "Every 2 weeks", short: "2 wks" },
  { value: "monthly", label: "Every month", short: "monthly" },
  { value: "2-months", label: "Every 2 months", short: "2 mos" },
  { value: "3-months", label: "Every 3 months", short: "3 mos" },
];

export function frequencyLabel(value: string): string {
  return (
    SUBSCRIPTION_FREQUENCIES.find((f) => f.value === value)?.label || value
  );
}

export type SubscriptionIntent = {
  productId: number;
  name: string;
  frequency: SubscriptionFrequency;
  quantity: number;
  variation?: string;
};

const STORAGE_KEY = "sc_subscriptions";

export function readSubscriptions(): SubscriptionIntent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubscriptionIntent[]) : [];
  } catch {
    return [];
  }
}

function writeSubscriptions(list: SubscriptionIntent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("sc-subscriptions-change"));
  } catch {
    /* storage unavailable — subscription note simply won't prefill */
  }
}

export function addSubscription(intent: SubscriptionIntent) {
  const list = readSubscriptions();
  const existing = list.findIndex(
    (s) => s.productId === intent.productId && s.variation === intent.variation
  );
  if (existing >= 0) {
    list[existing] = intent;
  } else {
    list.push(intent);
  }
  writeSubscriptions(list);
}

export function clearSubscriptions() {
  writeSubscriptions([]);
}

export function subscriptionNote(list: SubscriptionIntent[]): string {
  if (!list.length) return "";
  const lines = list.map((s) => {
    const variation = s.variation ? ` (${s.variation})` : "";
    const qty = s.quantity > 1 ? ` ×${s.quantity}` : "";
    return `• ${s.name}${variation}${qty} — deliver ${frequencyLabel(
      s.frequency
    ).toLowerCase()}`;
  });
  return [
    "SUBSCRIBE & SAVE requests (please set up recurring delivery):",
    ...lines,
  ].join("\n");
}
