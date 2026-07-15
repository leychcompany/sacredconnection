import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--forest)] text-[rgba(247,242,232,.72)]">
      <div className="wrap">
        <div className="grid gap-12 border-b border-white/10 py-[72px] md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/assets/logo-header.webp"
              alt="Amazonia"
              width={250}
              height={79}
              className="mb-5 h-10 w-auto opacity-90 brightness-0 invert"
            />
            <p className="max-w-[300px] text-[13.5px] leading-relaxed text-[rgba(247,242,232,.82)]">
              Sacred Connection partners directly with indigenous communities of
              the Amazon, carrying authentic ceremonial medicine to seekers with
              fairness, reverence, and care.
            </p>
          </div>
          <div>
            <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--bone)]">
              Shop
            </p>
            <ul className="flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link href="/shop" className="hover:text-[var(--gold-light)]">
                  All Hapé
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bamboo-kuripe"
                  className="hover:text-[var(--gold-light)]"
                >
                  Kuripes & Tepis
                </Link>
              </li>
              <li>
                <Link href="/shop/cacao" className="hover:text-[var(--gold-light)]">
                  Cacao
                </Link>
              </li>
              <li>
                <Link href="/shop/kits" className="hover:text-[var(--gold-light)]">
                  Ceremony Kits
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--bone)]">
              Learn
            </p>
            <ul className="flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link href="/#story" className="hover:text-[var(--gold-light)]">
                  What is Hapé?
                </Link>
              </li>
              <li>
                <Link
                  href="/find-your-hape"
                  className="hover:text-[var(--gold-light)]"
                >
                  Find Your Hapé
                </Link>
              </li>
              <li>
                <Link href="/#tribes" className="hover:text-[var(--gold-light)]">
                  Our Tribes
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[var(--gold-light)]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--bone)]">
              Support
            </p>
            <ul className="flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link href="/cart" className="hover:text-[var(--gold-light)]">
                  Cart
                </Link>
              </li>
              <li>
                <a
                  href="https://sacred-snuff.com/my-account/"
                  className="hover:text-[var(--gold-light)]"
                >
                  My Account
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-7 text-xs leading-relaxed">
          <p>
            For adults 21+. Hapé contains tobacco (Nicotiana rustica) unless
            marked tobacco-free. These products and statements have not been
            evaluated by the FDA and are not intended to diagnose, treat, cure,
            or prevent any disease. Use respectfully and responsibly.
          </p>
          <div className="mt-3.5 flex flex-wrap justify-between gap-6">
            <span>© {new Date().getFullYear()} Sacred Connection</span>
            <span>Instagram · Facebook · YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
