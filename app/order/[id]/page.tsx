import Link from "next/link";
import { restFetch } from "@/lib/woo/client";

export const dynamic = "force-dynamic";

type WooOrder = {
  id: number;
  status: string;
  total: string;
  currency: string;
  billing: { first_name: string; email: string };
  line_items: Array<{ name: string; quantity: number; total: string }>;
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: WooOrder | null = null;
  let error: string | null = null;

  try {
    order = await restFetch<WooOrder>(`/orders/${id}`);
  } catch {
    error =
      "Order placed successfully. Connect WC_CONSUMER_KEY / WC_CONSUMER_SECRET to show full details here.";
  }

  return (
    <div className="py-16 md:py-24">
      <div className="wrap mx-auto max-w-[640px] text-center">
        <span className="eyebrow mb-4 block text-[var(--clay)]">Thank you</span>
        <h1 className="mb-4 font-[family-name:var(--serif)] text-[clamp(32px,4vw,44px)] font-normal">
          Your ceremony order is confirmed
        </h1>
        <p className="mb-8 text-[rgba(22,19,16,.65)]">
          Order #{id} has been created in WooCommerce. You will receive an email
          confirmation shortly.
        </p>

        {order && (
          <div className="mb-10 rounded-[4px] border border-[var(--line)] bg-white p-8 text-left">
            <p className="mb-2 text-sm uppercase tracking-wide text-[var(--moss)]">
              Status: {order.status}
            </p>
            <p className="mb-4 font-semibold">
              Total: {order.currency} {order.total}
            </p>
            <ul className="space-y-2 text-sm text-[rgba(22,19,16,.7)]">
              {order.line_items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && !order && (
          <p className="mb-8 rounded-[4px] border border-[var(--line)] bg-[var(--bone)] p-6 text-sm text-[rgba(22,19,16,.65)]">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-clay">
            Continue shopping
          </Link>
          <Link href="/" className="btn btn-ghost-dark">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
