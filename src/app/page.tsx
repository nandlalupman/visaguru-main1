import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Compass,
  Copy,
  FileX,
  FolderX,
  Globe2,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { FreeAnalysisForm } from "@/components/free-analysis-form";
import { LiveStats } from "@/components/live-stats";
import { PricingSection } from "@/components/pricing-section";
import { Reveal } from "@/components/reveal";
import { SocialProofTicker } from "@/components/social-proof-ticker";
import {
  getServices,
  getTestimonials,
  getGlobalFaqItems,
  getPricingTiers,
} from "@/lib/content-store";
import { getHomeContentConfig } from "@/lib/site-config";

export const metadata = {
  title: "Visa Rejected? Expert SOP and Refusal Recovery",
  description:
    "Premium visa refusal recovery for UK, Canada, Germany, Australia, and Schengen applications. Free refusal analysis in 2 hours.",
};

export default async function Home() {
  const [services, testimonials, faqItems, pricingTiers, homeContent] =
    await Promise.all([
      getServices(),
      getTestimonials(),
      getGlobalFaqItems(),
      getPricingTiers(),
      getHomeContentConfig(),
    ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "VisaGuru",
    image: "https://visaguru.live/og-image.jpg",
    url: "https://visaguru.live",
    telephone: "+91-99999-99999",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Mumbai",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "58",
    },
    sameAs: ["https://www.linkedin.com/company/visaguru"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <section className="hero-gradient grain-bg section-padding relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="hero-float-1" />
        <div className="hero-float-2" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <Reveal>
            <p className="inline-flex rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              {homeContent.heroTagline}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl leading-tight text-white md:text-6xl">
              {homeContent.heroTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-white/85 md:text-lg">
              {homeContent.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#free-analysis"
                className="btn-shimmer inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[var(--shadow-gold)]"
              >
                Get a Free Refusal Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#case-studies"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
              >
                See Success Stories
              </Link>
            </div>

            <div className="glass-card mt-8 grid gap-2 rounded-2xl p-4 text-xs text-white md:grid-cols-2 md:text-sm">
              <div className="flex flex-wrap gap-2">
                {homeContent.trustDestinations.map((item) => (
                  <span key={item} className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="self-center text-white/90">
                {homeContent.heroTrustMessage}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} variant="scale">
            <div className="glass-card rounded-3xl p-3">
              <Image
                src="/images/approved-document.svg"
                alt="Approved visa document illustration"
                width={760}
                height={520}
                className="h-auto w-full rounded-2xl"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <SocialProofTicker items={homeContent.socialProofTicker} />

      <section className="section-padding section-gradient-navy">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Why Visas Get Rejected and Why It&apos;s Not Your Fault
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-muted)]">
              Understanding the reasons empowers a stronger reapplication.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {homeContent.problemCards.map((card, index) => {
              const icons = [FileX, Banknote, FolderX, Compass, Copy, XCircle];
              const Icon = icons[index] ?? AlertTriangle;
              const colors = [
                "bg-red-50 text-red-500",
                "bg-amber-50 text-amber-600",
                "bg-orange-50 text-orange-500",
                "bg-blue-50 text-blue-500",
                "bg-purple-50 text-purple-500",
                "bg-rose-50 text-rose-500",
              ];
              return (
                <Reveal key={card.title} delay={index * 0.04}>
                  <article className="surface-card rounded-2xl p-5">
                    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors[index]}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xl text-[var(--color-navy)]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                      {card.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <p className="mt-7 flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-sm text-[var(--color-muted)]">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold)]" />
              <span>
                <span className="font-semibold text-[var(--color-navy)]">
                  Stat callout:
                </span>{" "}
                {homeContent.statCallout}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      <section className="section-padding section-gradient-warm">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Our 4-Step Visa Recovery System
            </h2>
            <p className="mt-3 text-center text-sm text-[var(--color-muted)]">
              Express 24-hour turnaround available for urgent cases.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {homeContent.processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <article className="surface-card relative rounded-2xl p-5 pt-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="step-number">{index + 1}</span>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                      {step.day}
                    </p>
                  </div>
                  <h3 className="text-xl text-[var(--color-navy)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              What We Handle
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-muted)]">
              Country-specific visa expertise with tailored recovery strategies.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <Reveal key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className={`surface-card ${service.accent} group block rounded-2xl p-5 transition hover:-translate-y-1`}
                >
                  <p className="text-3xl">{service.flag}</p>
                  <h3 className="mt-3 text-xl text-[var(--color-navy)]">{service.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{service.price}</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-gold)] transition-transform group-hover:translate-x-1">
                    View Details →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      <section className="section-padding section-gradient-gold">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Live Product Activity
            </h2>
            <p className="mt-3 text-center text-sm text-[var(--color-muted)]">
              Real-time platform metrics from submissions and account activity.
            </p>
          </Reveal>
          <div className="mt-8">
            <LiveStats />
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                {homeContent.trustStats.map((stat) => (
                  <article key={stat.label} className="surface-card rounded-2xl p-5">
                    <p className="font-mono text-3xl font-semibold text-[var(--color-navy)]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{stat.label}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="surface-card rounded-2xl p-6">
                <Image
                  src="/images/expert-priya.svg"
                  alt="Priya Mehta profile illustration"
                  width={360}
                  height={420}
                  className="mb-5 h-auto w-44 rounded-2xl"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                  Lead Expert
                </p>
                <h3 className="mt-2 text-2xl text-[var(--color-navy)]">
                  {homeContent.expertProfile.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {homeContent.expertProfile.role}
                </p>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  {homeContent.expertProfile.experience}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
                  {homeContent.expertProfile.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {homeContent.mediaLogos.map((logo) => (
                    <span
                      key={logo}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="case-studies" className="section-padding section-gradient-warm">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          {/* ── Stories + Reviews unified header ── */}
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Success Stories &amp; Client Reviews
            </p>
            <h2 className="mt-3 text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Real Visa Recovery Stories
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--color-muted)]">
              See how we turned refusals into approvals with strategic documentation and expert guidance.
            </p>
          </Reveal>

          {/* ── Case Study Cards ── */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {homeContent.caseStudies.map((caseStudy) => (
              <Reveal key={caseStudy.title}>
                <article className="surface-card rounded-2xl p-5">
                  <h3 className="text-xl text-[var(--color-navy)]">{caseStudy.title}</h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">{caseStudy.timeline}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Image
                      src="/images/case-before.svg"
                      alt="Before document state"
                      width={300}
                      height={220}
                      className="h-auto w-full rounded-xl"
                    />
                    <Image
                      src="/images/case-after.svg"
                      alt="After document state"
                      width={300}
                      height={220}
                      className="h-auto w-full rounded-xl"
                    />
                  </div>
                  <div className="mt-4 rounded-xl border border-[#f4d1cc] bg-[#fff4f2] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-red)]">
                      Before
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{caseStudy.before}</p>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#d6efe5] bg-[#eff9f4] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-green)]">
                      After
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{caseStudy.after}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-[var(--color-muted)]">
            Client names and documents changed for privacy. Actual case files
            available on request.
          </p>

          {/* ── Classical ornamental divider ── */}
          <div className="mx-auto my-16 flex max-w-xs items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-40" />
            <Star className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)] opacity-60" />
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-40" />
          </div>

          {/* ── Client Reviews ── */}
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Heard From Our Clients
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              Real reviews from real visa applicants we have helped.
            </p>
          </Reveal>
          <div className="mt-8 columns-1 gap-4 md:columns-3">
            {testimonials.map((item, tIdx) => {
              const initials = item.name.split(" ").map((w) => w[0]).join("");
              return (
                <Reveal key={item.name}>
                  <article className="surface-card mb-4 break-inside-avoid rounded-2xl p-5">
                    <div className="mb-3 flex items-center gap-1 text-[var(--color-gold)]">
                      {[...Array(item.rating)].map((_, idx) => (
                        <Star key={`${item.name}-${idx}`} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      &quot;{item.feedback}&quot;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className={`avatar-initial avatar-${tIdx % 6}`}>
                        {initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-navy)]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {item.country} · {item.date}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <a
              href={homeContent.googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition-all duration-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            >
              Read 50+ reviews on Google →
            </a>
          </div>
        </div>
      </section>

      <div className="gold-shimmer-divider" />

      <section className="section-padding section-gradient-navy">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Transparent Pricing. No Hidden Fees.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)]">
              Choose a plan that fits your case. All plans include a satisfaction guarantee.
            </p>
          </Reveal>
          <PricingSection tiers={pricingTiers} />
        </div>
      </section>

      <section className="section-padding bg-[var(--color-surface)]">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-center text-3xl text-[var(--color-navy)] md:text-5xl">
              Common Questions
            </h2>
          </Reveal>
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section id="free-analysis" className="section-padding">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-[1fr_1.1fr] md:items-start md:px-6">
          <Reveal>
            <p className="inline-flex rounded-full bg-[#fff7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
              Final Step
            </p>
            <h2 className="mt-4 text-4xl leading-tight text-[var(--color-navy)] md:text-5xl">
              Don&apos;t Let One Rejection Define Your Future
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              Get a free refusal analysis within 2 hours. No commitment, no
              upfront payment. Create an account to track your case updates in
              your dashboard.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[var(--color-muted)]">
              <p className="flex items-start gap-2">
                <Globe2 className="mt-0.5 h-4 w-4 text-[var(--color-gold)]" />
                UK, Canada, Germany, Schengen, and Australia specialists
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-[var(--color-green)]" />
                256-bit encrypted uploads and strict document privacy
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <FreeAnalysisForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
