import { NextResponse } from "next/server";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/woo/cart";
import { getCartSession, setCartSession } from "@/lib/cart-session";

export async function GET() {
  try {
    const session = await getCartSession();
    const { cart, cartToken, nonce } = await getCart(session.cartToken);
    await setCartSession(cartToken, nonce ?? session.nonce);
    return NextResponse.json(cart);
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
    const session = await getCartSession();
    const action = body.action as string;

    let result;
    if (action === "add") {
      result = await addToCart({
        id: body.id,
        quantity: body.quantity ?? 1,
        variation: body.variation,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
    } else if (action === "update") {
      result = await updateCartItem({
        key: body.key,
        quantity: body.quantity,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
    } else if (action === "remove") {
      result = await removeCartItem({
        key: body.key,
        cartToken: session.cartToken,
        nonce: session.nonce,
      });
    } else {
      return NextResponse.json({ message: "Unknown action" }, { status: 400 });
    }

    await setCartSession(result.cartToken, result.nonce ?? session.nonce);
    return NextResponse.json(result.cart);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Cart error" },
      { status: 500 }
    );
  }
}
