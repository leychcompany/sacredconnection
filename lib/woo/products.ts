import { storeFetch } from "./client";
import type { ProductCategory, StoreProduct } from "./types";

const CATALOG_REVALIDATE = 300;

export async function getProducts(params: {
  page?: number;
  perPage?: number;
  category?: number | string;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
  slug?: string;
} = {}): Promise<StoreProduct[]> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("per_page", String(params.perPage ?? 24));
  if (params.category) q.set("category", String(params.category));
  if (params.search) q.set("search", params.search);
  if (params.orderby) q.set("orderby", params.orderby);
  if (params.order) q.set("order", params.order);
  if (params.slug) q.set("slug", params.slug);

  const { data } = await storeFetch<StoreProduct[]>(`/products?${q}`, {
    next: { revalidate: CATALOG_REVALIDATE, tags: ["products"] },
  });
  return data;
}

export async function getProductBySlug(
  slug: string
): Promise<StoreProduct | null> {
  const products = await getProducts({ slug, perPage: 1 });
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<StoreProduct> {
  const { data } = await storeFetch<StoreProduct>(`/products/${id}`, {
    next: { revalidate: CATALOG_REVALIDATE, tags: ["products", `product-${id}`] },
  });
  return data;
}

export async function getCategories(): Promise<ProductCategory[]> {
  const { data } = await storeFetch<ProductCategory[]>(
    "/products/categories?per_page=100",
    { next: { revalidate: CATALOG_REVALIDATE, tags: ["categories"] } }
  );
  return data.filter((c) => (c.count ?? 0) > 0);
}

export async function getCategoryBySlug(
  slug: string
): Promise<ProductCategory | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

/** Featured / bestseller picks for homepage — falls back to newest if tags missing */
export async function getFeaturedProducts(
  limit = 4
): Promise<StoreProduct[]> {
  try {
    const products = await getProducts({
      perPage: limit,
      orderby: "popularity",
      order: "desc",
    });
    return products;
  } catch {
    return getProducts({ perPage: limit });
  }
}
