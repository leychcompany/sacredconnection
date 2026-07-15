import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { getProductBySlug } from "@/lib/woo/products";
import { stripHtml } from "@/lib/woo/types";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product" };
  return {
    title: stripHtml(product.name),
    description: stripHtml(product.short_description).slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const image = product.images[0];

  return (
    <div className="py-16 md:py-24">
      <div className="wrap grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="rounded-[4px] bg-[var(--sand)] p-8 md:p-12">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || stripHtml(product.name)}
              width={900}
              height={900}
              className="w-full object-contain"
              priority
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-[rgba(22,19,16,.4)]">
              No image
            </div>
          )}
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img) => (
                <Image
                  key={img.id}
                  src={img.thumbnail || img.src}
                  alt={img.alt || ""}
                  width={160}
                  height={160}
                  className="aspect-square rounded object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <Link href="/shop" className="mb-4 inline-block text-sm text-[var(--clay)]">
            ← Back to shop
          </Link>
          {product.categories[0] && (
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--moss)]">
              {product.categories[0].name}
            </div>
          )}
          <h1 className="mb-4 font-[family-name:var(--serif)] text-[clamp(28px,3.5vw,40px)] font-normal leading-tight">
            {stripHtml(product.name)}
          </h1>
          {Number(product.average_rating) > 0 && (
            <div className="mb-4 text-[13px] tracking-[1.5px] text-[#C98A2B]">
              ★★★★★{" "}
              <span className="tracking-normal text-[#5c554d]">
                ({product.review_count})
              </span>
            </div>
          )}
          {product.short_description && (
            <p className="mb-8 text-[rgba(22,19,16,.7)]">
              {stripHtml(product.short_description)}
            </p>
          )}

          <ProductPurchase product={product} />

          {product.description && (
            <div
              className="prose-ritual mt-12 border-t border-[var(--line)] pt-10 text-[15px] leading-relaxed text-[rgba(22,19,16,.72)]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
