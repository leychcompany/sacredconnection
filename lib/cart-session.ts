import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const CART_TOKEN_COOKIE = "wc_cart_token";
export const CART_NONCE_COOKIE = "wc_cart_nonce";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function getCartSession(): Promise<{
  cartToken: string | null;
  nonce: string | null;
}> {
  const jar = await cookies();
  return {
    cartToken: jar.get(CART_TOKEN_COOKIE)?.value ?? null,
    nonce: jar.get(CART_NONCE_COOKIE)?.value ?? null,
  };
}

export function applyCartSession(
  response: NextResponse,
  cartToken: string | null,
  nonce: string | null
): NextResponse {
  if (cartToken) {
    response.cookies.set(CART_TOKEN_COOKIE, cartToken, COOKIE_OPTS);
  }
  if (nonce) {
    response.cookies.set(CART_NONCE_COOKIE, nonce, COOKIE_OPTS);
  }
  return response;
}

/** @deprecated Prefer applyCartSession on the NextResponse */
export async function setCartSession(
  cartToken: string | null,
  nonce: string | null
): Promise<void> {
  const jar = await cookies();
  if (cartToken) jar.set(CART_TOKEN_COOKIE, cartToken, COOKIE_OPTS);
  if (nonce) jar.set(CART_NONCE_COOKIE, nonce, COOKIE_OPTS);
}
