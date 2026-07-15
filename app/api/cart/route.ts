import { NextResponse } from "next/server";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/woo/cart";
import { applyCartSession, getCartSession } from "@/lib/cart-session";

export async function GET() {
  try {
    const session = await getCartSession();
    const { cart, cartToken, nonce } = await getCart(session.cartToken);
    const res = NextResponse.json(cart);
    return applyCartSession(res, cartToken, nonce ?? session.nonce);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to load cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let session = await getCartSession();

    if (!session.nonce || !session.cartToken) {
      const boot = await getCart(session.cartToken);
      session = { cartToken: boot.cartToken, nonce: boot.nonce };
    }

    const action = body.action as string;
    const withSession = {
      cartToken: session.cartToken,
      nonce: session.nonce,
    };

    let result;
    try {
      if (action === "add") {
        result = await addToCart({
          id: Number(body.id),
          quantity: body.quantity ?? 1,
          variation: body.variation,
          ...withSession,
        });
      } else if (action === "update") {
        result = await updateCartItem({
          key: body.key,
          quantity: body.quantity,
          ...withSession,
        });
      } else if (action === "remove") {
        result = await removeCartItem({
          key: body.key,
          ...withSession,
        });
      } else {
        return NextResponse.json({ message: "Unknown action" }, { status: 400 });
      }
    } catch {
      const boot = await getCart(null);
      session = { cartToken: boot.cartToken, nonce: boot.nonce };
      const retry = { cartToken: boot.cartToken, nonce: boot.nonce };
      if (action === "add") {
        result = await addToCart({
          id: Number(body.id),
          quantity: body.quantity ?? 1,
          variation: body.variation,
          ...retry,
        });
      } else if (action === "update") {
        result = await updateCartItem({
          key: body.key,
          quantity: body.quantity,
          ...retry,
        });
      } else if (action === "remove") {
        result = await removeCartItem({ key: body.key, ...retry });
      } else {
        throw new Error("Unknown action");
      }
    }

    const res = NextResponse.json(result.cart);
    return applyCartSession(res, result.cartToken, result.nonce ?? session.nonce);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Cart error" },
      { status: 500 }
    );
  }
}
