import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getFeaturedProducts } from "@/lib/woo/products";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";

export const revalidate = 300;

export default async function HomePage() {
  const products = await getFeaturedProducts(4).catch(() => []);
  const featured = products[0];

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden text-white">
        <Image
          src="/assets/hero.webp"
          alt=""
          fill
          priority
          className="object-cover object-[70%_25%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(100deg,rgba(13,18,14,.92) 0%,rgba(13,18,14,.66) 45%,rgba(13,18,14,.18) 100%),linear-gradient(to top,rgba(13,18,14,.85) 0%,transparent 35%)",
          }}
        />
        <div className="wrap relative z-[2] w-full">
          <div className="max-w-[640px] py-[120px]">
            <span className="eyebrow mb-[22px] flex items-center gap-3.5 text-[var(--gold)] before:block before:h-px before:w-9 before:bg-[var(--gold)]">
              Ceremonial Amazonian Hapé · Made by Indigenous Hands
            </span>
            <h1 className="mb-[26px] font-[family-name:var(--serif)] text-[clamp(40px,5.4vw,68px)] font-normal leading-[1.14] tracking-[-0.01em]">
              Ancient rituals,
              <br />
              <em className="font-normal italic text-[var(--gold-light)]">
                from the Amazon
                <br />
                to your door.
              </em>
            </h1>
            <p className="mb-[38px] max-w-[520px] text-lg leading-relaxed text-white/85">
              For generations, the tribes of the Amazon have prepared hapé as a
              sacred bridge — between body and spirit, forest and breath. We
              carry that medicine to your practice, exactly as it was made: with
              prayer, fire, and intention.
            </p>
            <div className="mb-12 flex flex-wrap gap-4">
              <Link href="/shop" className="btn btn-clay">
                Explore the Medicine
              </Link>
              <Link href="/find-your-hape" className="btn btn-ghost">
                Find Your Hapé
              </Link>
            </div>
            <div className="flex flex-wrap gap-7 text-[13px] text-white/75">
              <span>
                <span className="tracking-[2px] text-[var(--gold)]">★★★★★</span>{" "}
                4.9 from 2,300+ reviews
              </span>
              <span>✦ Sourced from 9 tribal nations</span>
              <span>✦ Ships from the USA</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 bg-[var(--forest)] text-[var(--bone)]">
        <div className="wrap grid grid-cols-2 md:grid-cols-4">
          {[
            ["Direct From the Tribes", "Fair-trade partnership, no middlemen"],
            ["100% Pure", "No additives, no fillers — ever"],
            ["Small Batch", "Prepared in ceremony, sealed fresh"],
            ["Fast US Shipping", "Free over $100 · ships in 24h"],
          ].map(([title, sub], i) => (
            <div
              key={title}
              className={`px-[18px] py-[22px] text-center text-[13px] tracking-[0.06em] ${i ? "border-l border-white/10" : ""}`}
            >
              <b className="mb-1 block text-[13px] uppercase tracking-[0.14em] text-[var(--gold-light)]">
                {title}
              </b>
              <span className="text-[rgba(247,242,232,.6)]">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section className="bg-[var(--bone)] py-[104px]" id="story">
        <div className="wrap grid items-center gap-[72px] md:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow mb-4 block text-[var(--clay)]">
              What is Hapé?
            </span>
            <h2 className="mb-6 font-[family-name:var(--serif)] text-[clamp(30px,3.6vw,42px)] font-normal leading-[1.18]">
              A prayer you receive through the breath.
            </h2>
            <p className="mb-6 font-[family-name:var(--serif)] text-[21px] italic leading-normal text-[var(--moss)]">
              &ldquo;Hapé is not taken. It is received — the forest speaking
              directly to your spirit.&rdquo;
            </p>
            <p className="mb-[18px] text-[16.5px] text-[rgba(22,19,16,.72)]">
              Hapé is a sacred snuff of finely ground mapacho tobacco and
              ceremonial plants, prepared over days of ritual by indigenous
              healers in the Amazon basin. Each tribe guards its own recipes,
              passed from elder to apprentice for centuries.
            </p>
            <p className="mb-[18px] text-[16.5px] text-[rgba(22,19,16,.72)]">
              It is not smoked, and it is not a recreational product.
              Administered through the nose with a kuripe or tepi pipe, hapé is
              used in ceremony to ground the body, quiet the mind, clear stagnant
              energy, and open a deeper state of presence and connection.
            </p>
            <Link
              href="/find-your-hape"
              className="mt-2 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--clay)]"
            >
              Find your first blend →
            </Link>
            <div className="mt-[30px] text-[13px] tracking-[0.05em] text-[#5c554d]">
              Pictured: Gesileu Phaspy Ninawa, master hapé maker and partner of
              Sacred Connection.
            </div>
          </div>
          <div className="relative">
            <Image
              src="/assets/gesileu.webp"
              alt="Gesileu Phaspy Ninawa, master hapé maker"
              width={720}
              height={739}
              className="relative z-[1] aspect-[4/4.6] w-full rounded-[3px] object-cover"
            />
            <div className="pointer-events-none absolute inset-[18px_-18px_-18px_18px] -z-0 rounded-[3px] border border-[var(--gold)]" />
          </div>
        </div>
      </section>

      {/* RITUAL */}
      <section className="bg-[var(--forest)] py-[104px] text-[var(--bone)]">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-[680px] text-center">
            <div className="mx-auto mb-[18px] flex items-center justify-center gap-3 text-[var(--gold)] before:h-px before:w-12 before:bg-[var(--gold)] after:h-px after:w-12 after:bg-[var(--gold)]">
              ✦
            </div>
            <h2 className="mb-[18px] font-[family-name:var(--serif)] text-[clamp(32px,4vw,46px)] font-normal leading-[1.15] text-[var(--bone)]">
              Your first ceremony, in three movements
            </h2>
            <p className="text-[17px] text-[rgba(247,242,232,.6)]">
              You don&apos;t need to be a shaman. You need a quiet moment, an
              open heart, and respect for the medicine.
            </p>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              [
                "I",
                "Set your intention",
                "Find a calm space. Light palo santo if you wish. Ask yourself what you are seeking — grounding, clarity, release — and hold that question gently.",
              ],
              [
                "II",
                "Receive the medicine",
                "Using a kuripe (self-applicator), place a pea-sized amount and administer to each nostril with a steady breath. Strong at first — then a wave of stillness.",
              ],
              [
                "III",
                "Sit in the silence",
                "Close your eyes for 10–15 minutes. Let the medicine ground you. Many feel a deep clearing of the mind and a quiet, rooted connection to the present.",
              ],
            ].map(([num, title, body]) => (
              <div key={num} className="bg-[var(--forest)] px-9 py-12">
                <span className="mb-5 block font-[family-name:var(--serif)] text-[15px] tracking-[0.2em] text-[var(--gold)]">
                  {num}
                </span>
                <h3 className="mb-3.5 font-[family-name:var(--serif)] text-2xl font-medium text-white">
                  {title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[rgba(247,242,232,.65)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-[52px] text-center">
            <Link href="/#guide" className="btn btn-clay">
              Get the Free First Ceremony Guide
            </Link>
          </div>
        </div>
      </section>

      {/* INTENTIONS */}
      <section className="py-[104px]" id="intentions">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-[680px] text-center">
            <span className="eyebrow mb-4 block text-[var(--clay)]">
              Begin With Purpose
            </span>
            <h2 className="mb-[18px] font-[family-name:var(--serif)] text-[clamp(32px,4vw,46px)] font-normal leading-[1.15]">
              Shop by intention
            </h2>
            <p className="text-[17px] text-[rgba(22,19,16,.65)]">
              Nine tribes, dozens of blends. Begin with what your spirit is
              asking for.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Grounding", "Caboclo Paricá · Apurinã blends", "intent-grounding.webp", "For rooting & presence"],
              ["Clarity", "Nukini 7 Stars · Bashawa", "intent-clarity.webp", "For focus & vision"],
              ["Cleansing", "Shawãdawa Spiritual · Sananga", "intent-cleansing.webp", "For release & renewal"],
              ["Connection", "Feminine Force · Heart of the Boa", "intent-connection.webp", "For heart & ceremony"],
            ].map(([title, sub, img, eye]) => (
              <Link
                key={title}
                href="/shop"
                className="relative flex aspect-[3/4] items-end overflow-hidden rounded-[3px] p-7 text-white transition hover:-translate-y-1.5"
              >
                <Image
                  src={`/assets/${img}`}
                  alt=""
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,14,11,.92)] via-[rgba(10,14,11,.25)] to-[rgba(10,14,11,.1)]" />
                <div className="relative z-[2]">
                  <span className="eyebrow mb-2 block text-[10.5px] text-[var(--gold)]">
                    {eye}
                  </span>
                  <h3 className="mb-1.5 font-[family-name:var(--serif)] text-[26px] font-medium">
                    {title}
                  </h3>
                  <p className="text-[13.5px] leading-snug text-white/75">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="bg-[var(--sand)] py-[104px]" id="month">
          <div className="wrap grid items-center gap-[72px] md:grid-cols-2">
            <div className="relative rounded-[4px] bg-[var(--paper)] p-12 shadow-[0_30px_60px_-30px_rgba(22,19,16,.25)]">
              <span className="absolute left-6 top-6 rounded-[2px] bg-[var(--clay)] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                Featured
              </span>
              {featured.images[0] && (
                <Image
                  src={featured.images[0].src}
                  alt={stripHtml(featured.name)}
                  width={900}
                  height={900}
                  className="w-full"
                />
              )}
            </div>
            <div>
              <span className="eyebrow mb-3.5 block text-[var(--clay-dark)]">
                Start Here
              </span>
              <h2 className="mb-2 font-[family-name:var(--serif)] text-[clamp(30px,3.4vw,40px)] font-normal leading-[1.15]">
                {stripHtml(featured.name)}
              </h2>
              {featured.categories[0] && (
                <span className="mb-[18px] block text-sm font-semibold tracking-[0.06em] text-[var(--moss)]">
                  {featured.categories[0].name}
                </span>
              )}
              <p className="mb-6 text-[rgba(22,19,16,.7)]">
                {stripHtml(featured.short_description) ||
                  "Prepared in ceremony, sealed fresh, and shipped from the USA."}
              </p>
              <div className="mb-[26px] font-[family-name:var(--serif)] text-[34px] font-medium">
                {formatStorePrice(
                  featured.prices.price,
                  featured.prices.currency_minor_unit,
                  featured.prices.currency_code
                )}
              </div>
              {featured.type === "simple" ? (
                <AddToCartButton
                  productId={featured.id}
                  label="Add to Cart — Begin Your Ceremony"
                />
              ) : (
                <Link href={`/product/${featured.slug}`} className="btn btn-clay">
                  Choose Options
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      <section className="py-[104px]" id="shop">
        <div className="wrap">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow mb-3 block text-[var(--clay)]">
                From Our Circle
              </span>
              <h2 className="font-[family-name:var(--serif)] text-[clamp(30px,3.6vw,42px)] font-normal">
                The medicines our circle returns to
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-[15px] font-semibold text-[var(--clay)]"
            >
              View all blends →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CEREMONY TOOLS */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] py-[104px]" id="ceremony-tools">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-[680px] text-center">
            <span className="eyebrow mb-4 block text-[var(--clay)]">
              Complete the Ritual
            </span>
            <h2 className="mb-[18px] font-[family-name:var(--serif)] text-[clamp(32px,4vw,46px)] font-normal leading-[1.15]">
              Tools for your ceremony
            </h2>
            <p className="text-[17px] text-[rgba(22,19,16,.65)]">
              The medicine is half of the practice. These are its companions —
              the instruments and botanicals that hold the space.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Bamboo Kuripe", "Applicator Pipe", "/assets/thumb-kuripe.jpg", "/shop/bamboo-kuripe"],
              ["Palo Santo", "Sacred Smoke", "/assets/thumb-palosanto.jpg", "/shop/incense"],
              ["Sananga", "Companion Medicine", "/assets/prod-sananga.webp", "/shop"],
              ["Ceremonial Cacao", "Heart Opener", "/assets/thumb-cacao.jpg", "/shop/cacao"],
            ].map(([title, tribe, img, href]) => (
              <Link
                key={title}
                href={href}
                className="overflow-hidden rounded-[3px] border border-[var(--line)] bg-white transition hover:-translate-y-1"
              >
                <div className="bg-[var(--paper)]">
                  <Image
                    src={img}
                    alt={title}
                    width={480}
                    height={480}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <div className="p-[22px]">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--moss)]">
                    {tribe}
                  </div>
                  <h3 className="font-[family-name:var(--serif)] text-[19px] font-medium">
                    {title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRIBES */}
      <section className="bg-[var(--forest-2)] py-[104px] text-[var(--bone)]" id="tribes">
        <div className="wrap">
          <div className="mx-auto mb-16 max-w-[680px] text-center">
            <div className="mx-auto mb-[18px] flex items-center justify-center gap-3 text-[var(--gold)] before:h-px before:w-12 before:bg-[var(--gold)] after:h-px after:w-12 after:bg-[var(--gold)]">
              ✦
            </div>
            <h2 className="mb-[18px] font-[family-name:var(--serif)] text-[clamp(32px,4vw,46px)] font-normal leading-[1.15] text-[var(--bone)]">
              Every tin carries a name, a face, a nation
            </h2>
            <p className="text-[17px] text-[rgba(247,242,232,.6)]">
              We don&apos;t buy from distributors. We sit with the makers. Meet
              the guardians of this medicine — our partners in nine tribal
              nations across the Brazilian Amazon.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Panã", "Katukina", "tribe-pana.webp"],
              ["Xiti", "Nukini", "tribe-xiti.jpg"],
              ["Shawãcaiá", "Shawãdawa", "tribe-shawacaia.jpg"],
              ["Nawashahu", "Yawanawá", "tribe-nawashahu.jpg"],
            ].map(([name, nation, img]) => (
              <div
                key={name}
                className="relative aspect-[3/4.2] overflow-hidden rounded-[3px]"
              >
                <Image
                  src={`/assets/${img}`}
                  alt={`${name} of the ${nation}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gold-light)]">
                    {nation}
                  </div>
                  <div className="font-[family-name:var(--serif)] text-2xl">{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL / GUIDE */}
      <section className="bg-[var(--forest)] py-[104px] text-[var(--bone)]" id="guide">
        <div className="wrap mx-auto max-w-[640px] text-center">
          <h2 className="mb-4 font-[family-name:var(--serif)] text-[clamp(30px,4vw,40px)] font-normal text-white">
            Begin your practice with reverence.
          </h2>
          <p className="mb-8 text-[rgba(247,242,232,.65)]">
            Enter your email and we&apos;ll send you our 12-page First Ceremony
            Guide — plus 10% off your first order.
          </p>
          <form className="mx-auto flex max-w-[440px] flex-col gap-2.5 sm:flex-row">
            <label htmlFor="guide-email" className="visually-hidden">
              Email address
            </label>
            <input
              id="guide-email"
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 rounded-[2px] border border-white/20 bg-white/10 px-[18px] py-3.5 text-white placeholder:text-white/40"
            />
            <button type="submit" className="btn btn-clay shrink-0 px-6 py-3.5 text-sm">
              Send My Guide
            </button>
          </form>
          <p className="mt-3.5 text-xs text-[rgba(247,242,232,.72)]">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--bone)] py-[104px]" id="faq">
        <div className="wrap mx-auto max-w-[760px]">
          <div className="mb-12 text-center">
            <h2 className="font-[family-name:var(--serif)] text-[clamp(32px,4vw,46px)] font-normal">
              Before you begin
            </h2>
          </div>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {[
              [
                "Is hapé legal in the United States?",
                "Yes. Hapé containing tobacco is legal for adults 21+ in the US when sold as a ceremonial tobacco product. We ship from within the United States.",
              ],
              [
                "I've never used hapé. Which blend should I start with?",
                "Most beginners start with Caboclo Paricá or take our Find Your Hapé quiz for a personalized match. Begin gently and sit with the medicine.",
              ],
              [
                "Is this the same as recreational tobacco or snuff?",
                "No. Hapé is a ceremonial preparation used in moments of intention — not habitually. It is made from mapacho and sacred plants, ground by hand in ritual.",
              ],
              [
                "How do I know the tribes are treated fairly?",
                "We partner directly with makers across nine tribal nations — fair trade, no middlemen, and relationships built over years of sitting with the guardians of this medicine.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[26px] font-[family-name:var(--serif)] text-xl font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-[26px] font-light text-[var(--clay)] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-6 pr-12 text-[rgba(22,19,16,.72)]">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
