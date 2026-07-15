import { storeFetch } from "./client";
import type { Address, Cart, CheckoutResult } from "./types";

export async function getCart(cartToken?: string | null): Promise<{
  cart: Cart;
  cartToken: string | null;
  nonce: string | null;
}> {
  const result = await storeFetch<Cart>("/cart", {
    cartToken,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function addToCart(params: {
  id: number;
  quantity?: number;
  variation?: Array<{ attribute: string; value: string }>;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{ cart: Cart; cartToken: string | null; nonce: string | null }> {
  const result = await storeFetch<Cart>("/cart/add-item", {
    method: "POST",
    body: {
      id: params.id,
      quantity: params.quantity ?? 1,
      ...(params.variation ? { variation: params.variation } : {}),
    },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function updateCartItem(params: {
  key: string;
  quantity: number;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{ cart: Cart; cartToken: string | null; nonce: string | null }> {
  const result = await storeFetch<Cart>("/cart/update-item", {
    method: "POST",
    body: { key: params.key, quantity: params.quantity },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function removeCartItem(params: {
  key: string;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{ cart: Cart; cartToken: string | null; nonce: string | null }> {
  const result = await storeFetch<Cart>("/cart/remove-item", {
    method: "POST",
    body: { key: params.key },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function updateCustomer(params: {
  billing_address?: Partial<Address>;
  shipping_address?: Partial<Address>;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{ cart: Cart; cartToken: string | null; nonce: string | null }> {
  const result = await storeFetch<Cart>("/cart/update-customer", {
    method: "POST",
    body: {
      billing_address: params.billing_address,
      shipping_address: params.shipping_address,
    },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function selectShippingRate(params: {
  package_id: number;
  rate_id: string;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{ cart: Cart; cartToken: string | null; nonce: string | null }> {
  const result = await storeFetch<Cart>("/cart/select-shipping-rate", {
    method: "POST",
    body: {
      package_id: params.package_id,
      rate_id: params.rate_id,
    },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    cart: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}

export async function checkout(params: {
  billing_address: Address;
  shipping_address: Address;
  payment_method: string;
  customer_note?: string;
  cartToken?: string | null;
  nonce?: string | null;
}): Promise<{
  result: CheckoutResult;
  cartToken: string | null;
  nonce: string | null;
}> {
  const result = await storeFetch<CheckoutResult>("/checkout", {
    method: "POST",
    body: {
      billing_address: params.billing_address,
      shipping_address: params.shipping_address,
      payment_method: params.payment_method,
      customer_note: params.customer_note || "",
    },
    cartToken: params.cartToken,
    nonce: params.nonce,
    cache: "no-store",
  });
  return {
    result: result.data,
    cartToken: result.cartToken,
    nonce: result.nonce,
  };
}
