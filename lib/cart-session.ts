import { cookies } from "next/headers";

export const CART_TOKEN_COOKIE = "wc_cart_token";
export const CART_NONCE_COOKIE = "wc_cart_nonce";

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

export async function setCartSession(
  cartToken: string | null,
  nonce: string | null
): Promise<void> {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
  if (cartToken) jar.set(CART_TOKEN_COOKIE, cartToken, opts);
  if (nonce) jar.set(CART_NONCE_COOKIE, nonce, opts);
}
