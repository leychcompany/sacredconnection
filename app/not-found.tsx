import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="mb-4 font-[family-name:var(--serif)] text-4xl">
        Page not found
      </h1>
      <p className="mb-8 text-[rgba(22,19,16,.65)]">
        This path doesn&apos;t exist in the sacred storefront.
      </p>
      <Link href="/" className="btn btn-clay">
        Go home
      </Link>
    </div>
  );
}
