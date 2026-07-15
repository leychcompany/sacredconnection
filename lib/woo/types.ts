export type Money = {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
};

export type ProductPrice = Money & {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: null | {
    min_amount: string;
    max_amount: string;
  };
};

export type ProductImage = {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count?: number;
  image?: ProductImage | null;
};

export type ProductVariation = {
  id: number;
  attributes: Array<{ name: string; value: string }>;
};

export type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: "simple" | "variable" | "grouped" | "external" | string;
  variation: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: ProductPrice;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: ProductImage[];
  categories: Array<{ id: number; name: string; slug: string; link: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: Array<{ id: number; name: string; slug: string }>;
  }>;
  variations: ProductVariation[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: number | null;
  sold_individually: boolean;
  add_to_cart: {
    text: string;
    description: string;
    url: string;
    minimum: number;
    maximum: number;
    multiple_of: number;
  };
};

export type CartItem = {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: {
    minimum: number;
    maximum: number;
    multiple_of: number;
    editable: boolean;
  };
  name: string;
  short_description: string;
  description: string;
  sku: string;
  low_stock_remaining: number | null;
  backorders_allowed: boolean;
  show_backorder_badge: boolean;
  sold_individually: boolean;
  permalink: string;
  images: ProductImage[];
  variation: Array<{ attribute: string; value: string }>;
  item_data: unknown[];
  prices: ProductPrice & {
    raw_prices: {
      precision: number;
      price: string;
      regular_price: string;
      sale_price: string;
    };
  };
  totals: Money & {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
  };
  catalog_visibility: string;
};

export type CartTotals = Money & {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_price: string;
  total_tax: string;
  tax_lines: Array<{ name: string; price: string; rate: string }>;
};

export type Cart = {
  items: CartItem[];
  coupons: unknown[];
  fees: unknown[];
  totals: CartTotals;
  shipping_address: Address;
  billing_address: Address;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_requirements: string[];
  has_calculated_shipping: boolean;
  shipping_rates: ShippingPackage[];
  items_count: number;
  items_weight: number;
  cross_sells: StoreProduct[];
  errors: Array<{ code: string; message: string }>;
  payment_methods: string[];
  extensions: Record<string, unknown>;
};

export type Address = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type ShippingRate = {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: Array<{ key: string; value: string }>;
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
};

export type ShippingPackage = {
  package_id: number;
  name: string;
  destination: Address;
  items: Array<{ key: string; name: string; quantity: number }>;
  shipping_rates: ShippingRate[];
};

export type CheckoutResult = {
  order_id: number;
  order_key: string;
  customer_id: number;
  customer_note: string;
  payment_method: string;
  payment_result: {
    payment_status: string;
    payment_details: Array<{ key: string; value: string }>;
    redirect_url: string;
  };
  billing_address: Address;
  shipping_address: Address;
  status?: string;
};

export function formatStorePrice(
  amount: string | number | undefined | null,
  minorUnit = 2,
  currency = "USD"
): string {
  const raw = typeof amount === "string" ? parseInt(amount, 10) : amount ?? 0;
  const value = Number.isFinite(raw) ? raw / Math.pow(10, minorUnit) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
