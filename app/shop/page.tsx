import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getProducts } from "@/lib/woo/products";

export const revalidate = 300;

export const metadata = {
  title: "Shop",
  description: "Browse ceremonial hapé, kuripes, and sacred botanicals.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ perPage: 36, search: q }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const navCats = categories
    .filter((c) => (c.count ?? 0) >= 3)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 16);

  return (
    <div className="py-16 md:py-24">
      <div className="wrap">
        <div className="mb-12 max-w-[640px]">
          <span className="eyebrow mb-3 block text-[var(--clay)]">The Medicine</span>
          <h1 className="mb-4 font-[family-name:var(--serif)] text-[clamp(32px,4vw,48px)] font-normal">
            Shop ceremonial hapé & sacred tools
          </h1>
          <p className="text-[rgba(22,19,16,.65)]">
            Live catalog from our tribal partners — every product managed in
            WooCommerce, presented in this sacred space.
          </p>
        </div>

        {navCats.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Link
              href="/shop"
              className="rounded-full border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--bone)]"
            >
              All
            </Link>
            {navCats.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.slug}`}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <p className="py-20 text-center text-[rgba(22,19,16,.55)]">
            No products found. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
