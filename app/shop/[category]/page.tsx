import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/woo/products";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category).catch(() => null);
  return {
    title: cat?.name || "Shop",
    description: cat?.description || `Shop ${cat?.name || "products"}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  if (!cat) notFound();

  const [products, categories] = await Promise.all([
    getProducts({ category: cat.id, perPage: 36 }).catch(() => []),
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
          <Link href="/shop" className="mb-4 inline-block text-sm text-[var(--clay)]">
            ← All products
          </Link>
          <h1 className="mb-4 font-[family-name:var(--serif)] text-[clamp(32px,4vw,48px)] font-normal">
            {cat.name}
          </h1>
          {cat.description && (
            <p className="text-[rgba(22,19,16,.65)]">{cat.description}</p>
          )}
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium"
          >
            All
          </Link>
          {navCats.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                c.slug === slug
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bone)]"
                  : "border-[var(--line)] bg-white hover:border-[var(--ink)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
