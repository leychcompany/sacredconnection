import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/lib/woo/types";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: StoreProduct }) {
  const image = product.images[0];
  const price = formatStorePrice(
    product.prices.price,
    product.prices.currency_minor_unit,
    product.prices.currency_code
  );
  const tribe = product.categories[0]?.name;

  return (
    <article className="flex flex-col overflow-hidden rounded-[3px] border border-[var(--line)] bg-white transition hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(22,19,16,.18)]">
      <Link href={`/product/${product.slug}`} className="relative block bg-[var(--paper)]">
        {product.on_sale && (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-[2px] bg-[var(--forest)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--gold-light)]">
            Sale
          </span>
        )}
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || stripHtml(product.name)}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-[var(--sand)] text-sm text-[rgba(22,19,16,.4)]">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-[22px] pb-6 pt-5">
        {tribe && (
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--moss)]">
            {tribe}
          </div>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mb-2 font-[family-name:var(--serif)] text-[19px] font-medium leading-snug">
            {stripHtml(product.name)}
          </h3>
        </Link>
        {Number(product.average_rating) > 0 && (
          <div className="mb-2.5 text-[13px] tracking-[1.5px] text-[#C98A2B]">
            ★★★★★{" "}
            <span className="ml-1.5 tracking-normal text-[#5c554d]">
              ({product.review_count})
            </span>
          </div>
        )}
        <div className="mt-auto mb-4 text-base font-semibold">
          {product.type === "variable" ? `From ${price}` : price}
        </div>
        {product.type === "simple" && product.is_purchasable ? (
          <AddToCartButton productId={product.id} className="btn btn-dark w-full py-3 text-[13px]" />
        ) : (
          <Link
            href={`/product/${product.slug}`}
            className="btn btn-dark w-full py-3 text-[13px]"
          >
            {product.type === "variable" ? "Choose Options" : "View Product"}
          </Link>
        )}
      </div>
    </article>
  );
}
