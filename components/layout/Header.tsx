"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

type MegaItem = {
  href: string;
  title: string;
  desc: string;
  image: string;
};

function MegaPanel({
  eyebrow,
  heading,
  blurb,
  items,
}: {
  eyebrow: string;
  heading: string;
  blurb: string;
  items: MegaItem[];
}) {
  return (
    <div className="mega absolute left-0 right-0 top-full z-50 border-b border-[var(--line)] bg-[var(--paper)] opacity-0 invisible pointer-events-none -translate-y-3.5 shadow-[0_50px_70px_-40px_rgba(22,19,16,.35)] transition-all duration-280 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[300px_1fr] items-start gap-[60px] px-6 py-11">
        <div>
          <span className="eyebrow mb-3 block text-[var(--clay)]">{eyebrow}</span>
          <p className="font-[family-name:var(--serif)] text-[26px] font-normal leading-[1.22] text-[var(--ink)]">
            {heading}
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[rgba(22,19,16,.55)]">
            {blurb}
          </p>
        </div>
        <div className="grid grid-cols-2 content-start gap-x-9 gap-y-2.5">
          {items.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className="flex items-center gap-4 rounded-[5px] px-3.5 py-3 transition-colors hover:bg-[var(--bone)]"
            >
              <Image
                src={item.image}
                alt=""
                width={60}
                height={60}
                className="h-[60px] w-[60px] shrink-0 rounded-[7px] object-cover"
              />
              <span>
                <b className="mb-0.5 block text-[14.5px] font-semibold text-[var(--ink)]">
                  {item.title}
                </b>
                <span className="block text-[12.5px] leading-snug text-[rgba(22,19,16,.55)]">
                  {item.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chev() {
  return (
    <span
      aria-hidden
      className="mt-[-3px] h-[7px] w-[7px] border-r-[1.5px] border-b-[1.5px] border-current opacity-55 transition-transform group-hover:mt-[3px] group-hover:rotate-[225deg]"
      style={{ transform: "rotate(45deg)" }}
    />
  );
}

export function Header() {
  const { itemsCount } = useCart();

  return (
    <>
      <div className="bg-[var(--forest)] px-4 py-2.5 text-center text-[13px] tracking-[0.08em] text-[var(--gold-light)]">
        Free US shipping over $100 &nbsp;·&nbsp;{" "}
        <b className="font-semibold text-white">10% off your first order</b> with
        code <b className="font-semibold text-white">SACRED10</b> &nbsp;·&nbsp;
        Small-batch, ships from the USA
      </div>
      <header className="sticky top-0 z-[100] border-b border-[var(--line)] bg-[rgba(252,249,243,.92)] backdrop-blur-[12px]">
        <div className="wrap flex h-[72px] items-center justify-between gap-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/logo-header.webp"
              alt="Amazonia"
              width={250}
              height={79}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="nav-links hidden items-center gap-[30px] text-sm font-medium tracking-[0.03em] lg:flex">
            <div className="group relative static">
              <Link href="/shop" className="flex items-center gap-1.5 py-[26px]">
                Shop Hapé <Chev />
              </Link>
              <MegaPanel
                eyebrow="The Medicine"
                heading="Find the blend your spirit is asking for."
                blurb="Forty-plus medicines from nine tribal nations. One standard: pure, ceremonial, fair-trade."
                items={[
                  {
                    href: "/shop",
                    title: "All Hapé Blends",
                    desc: "40+ medicines from nine nations",
                    image: "/assets/prod-feminine-force.webp",
                  },
                  {
                    href: "/#intentions",
                    title: "Shop by Intention",
                    desc: "Grounding · clarity · cleansing · connection",
                    image: "/assets/intent-clarity.webp",
                  },
                  {
                    href: "/find-your-hape",
                    title: "Find Your Hapé",
                    desc: "2-minute quiz · personalized match",
                    image: "/assets/intent-grounding.webp",
                  },
                  {
                    href: "/shop",
                    title: "Beginner Friendly",
                    desc: "Start with Caboclo Paricá",
                    image: "/assets/prod-parica.webp",
                  },
                ]}
              />
            </div>

            <div className="group relative static">
              <Link
                href="/shop/artisan-kuripe-pipe-collection"
                className="flex items-center gap-1.5 py-[26px]"
              >
                Tools & Kuripes <Chev />
              </Link>
              <MegaPanel
                eyebrow="Instruments of Ceremony"
                heading="Hand-carved by the same hands that make the medicine."
                blurb="Every tool is crafted on tribal land using ancestral techniques."
                items={[
                  {
                    href: "/shop/bamboo-kuripe",
                    title: "Kuripes & Tepis",
                    desc: "Self-applicators and sharing pipes",
                    image: "/assets/thumb-kuripe.jpg",
                  },
                  {
                    href: "/shop/kits",
                    title: "Ceremony Kits",
                    desc: "Hapé + kuripe + companions",
                    image: "/assets/thumb-palosanto.jpg",
                  },
                ]}
              />
            </div>

            <div className="group relative static">
              <Link href="/shop/incense" className="flex items-center gap-1.5 py-[26px]">
                Sacred Botanicals <Chev />
              </Link>
              <MegaPanel
                eyebrow="Companions of the Medicine"
                heading="What the forest offers around the ceremony."
                blurb="Smoke, sight, and heart — botanicals that prepare the space and the spirit."
                items={[
                  {
                    href: "/shop/incense",
                    title: "Palo Santo & Smudge",
                    desc: "Cleanse your space before you begin",
                    image: "/assets/thumb-palosanto.jpg",
                  },
                  {
                    href: "/shop",
                    title: "Sananga Eye Drops",
                    desc: "The companion medicine for clear sight",
                    image: "/assets/prod-sananga.webp",
                  },
                  {
                    href: "/shop/cacao",
                    title: "Ceremonial Cacao",
                    desc: "Open the heart before ceremony",
                    image: "/assets/thumb-cacao.jpg",
                  },
                  {
                    href: "/shop/mapacho",
                    title: "Mapacho",
                    desc: "Sacred rope tobacco of the Amazon",
                    image: "/assets/thumb-mapacho.jpg",
                  },
                ]}
              />
            </div>

            <Link href="/#tribes" className="py-[26px]">
              Our Tribes
            </Link>

            <div className="group relative static">
              <Link href="/#story" className="flex items-center gap-1.5 py-[26px]">
                Learn <Chev />
              </Link>
              <MegaPanel
                eyebrow="Walk In With Reverence"
                heading="Understand the medicine before you receive it."
                blurb="Guides, stories, and the people behind every tin."
                items={[
                  {
                    href: "/#story",
                    title: "What is Hapé?",
                    desc: "A prayer received through the breath",
                    image: "/assets/gesileu.webp",
                  },
                  {
                    href: "/find-your-hape",
                    title: "Find Your Hapé",
                    desc: "Quiz for first-timers · free guide included",
                    image: "/assets/gesileu.webp",
                  },
                  {
                    href: "/#guide",
                    title: "First Ceremony Guide",
                    desc: "Free 12-page PDF for beginners",
                    image: "/assets/intent-connection.webp",
                  },
                  {
                    href: "/#faq",
                    title: "Questions & Answers",
                    desc: "Legality, freshness, fair trade",
                    image: "/assets/intent-grounding.webp",
                  },
                ]}
              />
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/find-your-hape"
              className="hidden rounded-[2px] bg-[var(--clay)] px-[22px] py-3 text-[13px] font-semibold tracking-[0.05em] text-white transition hover:bg-[var(--clay-dark)] sm:inline-flex"
            >
              Find Your Hapé
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center"
              aria-label={`Cart, ${itemsCount} items`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[21px] w-[21px] fill-none stroke-[var(--ink)]"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemsCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--clay)] text-[10px] font-bold text-white">
                  {itemsCount > 9 ? "9+" : itemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
