"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { StoreProduct } from "@/lib/woo/types";
import { formatStorePrice, stripHtml } from "@/lib/woo/types";

type Answers = {
  experience?: string;
  intention?: string;
  practice?: string;
  strength?: string;
};

const STEPS = ["welcome", "experience", "intention", "practice", "strength", "result"] as const;

function pickProduct(products: StoreProduct[], answers: Answers): StoreProduct | null {
  if (!products.length) return null;
  const intent = answers.intention;
  const keywords: Record<string, string[]> = {
    grounding: ["parica", "caboclo", "ground"],
    clarity: ["nukini", "7 stars", "bashawa", "clarity"],
    cleansing: ["spiritual", "shaw", "clean"],
    connection: ["feminine", "yawanawa", "heart", "love"],
    unsure: ["parica", "caboclo"],
  };
  const keys = keywords[intent || "unsure"] || keywords.unsure;
  const found = products.find((p) => {
    const hay = `${p.name} ${p.slug} ${p.short_description}`.toLowerCase();
    return keys.some((k) => hay.includes(k));
  });
  return found || products[0];
}

export function FindYourHapeQuiz({ products }: { products: StoreProduct[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const match = useMemo(
    () => pickProduct(products, answers),
    [products, answers]
  );

  function choose(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 280);
  }

  const progress = step === 0 ? 0 : (step / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-[70vh] bg-[var(--bone)] py-12 md:py-20">
      {step < STEPS.length - 1 && (
        <div className="wrap mb-10 max-w-[760px]">
          <div className="mb-2 flex justify-between text-[12px] uppercase tracking-[0.08em] text-[rgba(22,19,16,.45)]">
            <span>{STEPS[step]}</span>
            <span>
              {step === 0 ? "Start" : `${step} of ${STEPS.length - 2}`}
            </span>
          </div>
          <div className="h-[3px] overflow-hidden rounded bg-[var(--line)]">
            <div
              className="h-full bg-[var(--clay)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="wrap max-w-[760px]">
        {step === 0 && (
          <div className="text-center">
            <span className="eyebrow mb-4 block text-[var(--clay)]">
              Find Your Hapé
            </span>
            <h1 className="mb-5 font-[family-name:var(--serif)] text-[clamp(34px,5vw,48px)] font-normal leading-tight">
              Let the medicine find{" "}
              <em className="italic text-[var(--clay)]">you.</em>
            </h1>
            <p className="mx-auto mb-9 max-w-[540px] text-[17px] text-[rgba(22,19,16,.65)]">
              Answer a few questions and we&apos;ll match you with a blend from
              our live catalog — then add it to your cart when you&apos;re ready.
            </p>
            <button type="button" className="btn btn-clay" onClick={() => setStep(1)}>
              Begin — It Takes 2 Minutes
            </button>
          </div>
        )}

        {step === 1 && (
          <Question
            title="Have you worked with hapé before?"
            sub="This helps us calibrate strength and guidance."
            options={[
              ["first", "🌱", "This is completely new to me", "I've heard about it but never tried it"],
              ["some", "🍃", "I've tried it a few times", "Still learning what works for me"],
              ["regular", "🔥", "It's part of my practice", "I use hapé regularly in ceremony"],
            ]}
            onPick={(v) => choose("experience", v)}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <Question
            title="What are you hoping to experience?"
            sub="Pick what best matches what you're looking for."
            options={[
              ["grounding", "🌿", "Grounding & presence", "Feel rooted, calm, and in my body"],
              ["clarity", "✨", "Clarity & focus", "Quiet the noise and see clearly"],
              ["cleansing", "💧", "Cleansing & release", "Clear stagnant energy and let go"],
              ["connection", "💛", "Connection & heart-opening", "Deepen ceremony and open the heart"],
              ["unsure", "🌙", "I'm not sure yet", "Guide me to a gentle starting point"],
            ]}
            onPick={(v) => choose("intention", v)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Question
            title="How will you practice?"
            sub="This helps us recommend the right tools."
            options={[
              ["solo", "🧘", "Solo, in private ceremony", "Just me and the medicine"],
              ["sharing", "🤝", "Sharing with others", "Circles, partners, or guided sessions"],
              ["both", "🔄", "Both solo and sharing", "I want flexibility"],
            ]}
            onPick={(v) => choose("practice", v)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Question
            title="How deep do you want to go?"
            sub="We'll match intensity to your comfort level."
            options={[
              ["gentle", "🕊️", "Gentle & approachable", "A soft entry — especially for beginners"],
              ["balanced", "⚖️", "Balanced & steady", "Noticeable but not overwhelming"],
              ["deep", "🌊", "Deep & transformative", "I'm ready for a powerful experience"],
            ]}
            onPick={(v) => choose("strength", v)}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && match && (
          <div>
            <div className="mb-10 text-center">
              <span className="eyebrow mb-3 block text-[var(--clay)]">Your Match</span>
              <h2 className="mb-3 font-[family-name:var(--serif)] text-[clamp(28px,4vw,40px)] font-normal">
                {answers.experience === "first"
                  ? "A gentle place to begin."
                  : "We found your blend."}
              </h2>
              <p className="text-[rgba(22,19,16,.6)]">
                Based on what you shared, this live product is a strong fit.
              </p>
            </div>
            <div className="overflow-hidden rounded-[4px] border border-[var(--line)] bg-white">
              <div className="bg-[var(--forest)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--gold-light)]">
                Recommended for you
              </div>
              <div className="grid md:grid-cols-[200px_1fr]">
                {match.images[0] && (
                  <Image
                    src={match.images[0].src}
                    alt={stripHtml(match.name)}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover"
                  />
                )}
                <div className="flex flex-col justify-center p-8">
                  {match.categories[0] && (
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--moss)]">
                      {match.categories[0].name}
                    </div>
                  )}
                  <h3 className="mb-3 font-[family-name:var(--serif)] text-[26px] font-medium">
                    {stripHtml(match.name)}
                  </h3>
                  <p className="mb-4 text-[15px] text-[rgba(22,19,16,.68)]">
                    {stripHtml(match.short_description) ||
                      "Prepared in ceremony and sealed fresh."}
                  </p>
                  <div className="mb-5 text-lg font-semibold">
                    {formatStorePrice(
                      match.prices.price,
                      match.prices.currency_minor_unit,
                      match.prices.currency_code
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {match.type === "simple" && match.is_purchasable ? (
                      <AddToCartButton productId={match.id} />
                    ) : (
                      <Link href={`/product/${match.slug}`} className="btn btn-clay">
                        View product
                      </Link>
                    )}
                    <Link href={`/product/${match.slug}`} className="btn btn-ghost-dark">
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center gap-3">
              <Link href="/shop" className="btn btn-ghost-dark">
                Browse all
              </Link>
              <button
                type="button"
                className="btn btn-ghost-dark"
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {step === 5 && !match && (
          <div className="text-center">
            <p className="mb-6">We couldn&apos;t load products right now.</p>
            <Link href="/shop" className="btn btn-clay">
              Browse the shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Question({
  title,
  sub,
  options,
  onPick,
  onBack,
}: {
  title: string;
  sub: string;
  options: string[][];
  onPick: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="mb-2.5 text-center font-[family-name:var(--serif)] text-[clamp(28px,4vw,36px)] font-normal">
        {title}
      </h2>
      <p className="mb-9 text-center text-[15px] text-[rgba(22,19,16,.55)]">{sub}</p>
      <div className="grid gap-3">
        {options.map(([value, icon, label, desc]) => (
          <button
            key={value}
            type="button"
            onClick={() => onPick(value)}
            className="flex w-full items-start gap-[18px] rounded border-[1.5px] border-[var(--line)] bg-white px-[22px] py-5 text-left transition hover:border-[var(--gold)] hover:bg-[var(--paper)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--bone)] text-[22px]">
              {icon}
            </span>
            <span>
              <b className="mb-0.5 block text-[15.5px]">{label}</b>
              <span className="text-[13.5px] text-[rgba(22,19,16,.55)]">{desc}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-10">
        <button type="button" className="btn btn-ghost-dark" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
