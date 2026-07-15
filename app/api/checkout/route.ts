import { NextResponse } from "next/server";
import { checkout, getCart, selectShippingRate, updateCustomer } from "@/lib/woo/cart";
import type { Address } from "@/lib/woo/types";
import { applyCartSession, getCartSession } from "@/lib/cart-session";

async function ensureSession() {
  let session = await getCartSession();
  if (!session.nonce || !session.cartToken) {
    const boot = await getCart(session.cartToken);
    session = { cartToken: boot.cartToken, nonce: boot.nonce };
  }
  return session;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await ensureSession();
    const action = body.action as string;

    if (action === "update-customer") {
      const result = await updateCustomer({
        billing_address: body.billing_address as Partial<Address>,
        shipping_address: body.shipping_address as Partial<Address>,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
      const res = NextResponse.json(result.cart);
      return applyCartSession(res, result.cartToken, result.nonce ?? session.nonce);
    }

    if (action === "select-shipping") {
      const result = await selectShippingRate({
        package_id: body.package_id,
        rate_id: body.rate_id,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
      const res = NextResponse.json(result.cart);
      return applyCartSession(res, result.cartToken, result.nonce ?? session.nonce);
    }

    if (action === "checkout") {
      const result = await checkout({
        billing_address: body.billing_address as Address,
        shipping_address: body.shipping_address as Address,
        payment_method: body.payment_method || "stripe",
        customer_note: body.customer_note,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
      const res = NextResponse.json(result.result);
      return applyCartSession(res, result.cartToken, result.nonce ?? session.nonce);
    }

    return NextResponse.json({ message: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Checkout error" },
      { status: 500 }
    );
  }
}
