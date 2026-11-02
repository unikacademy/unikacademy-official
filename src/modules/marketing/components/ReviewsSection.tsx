"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import OpenDemoPopupButton from "@/modules/demo-bookings/components/OpenDemoPopupButton";
import {
  TEXT_REVIEWS,
  VIDEO_REVIEWS,
  youtubeId,
  type TextReview,
  type VideoReview,
} from "../data/reviews";

// The section's one visual idea: a coach marking up a student's own words.
// A gold highlighter for the lines that matter, a gold strike through the old
// belief. Only the featured card animates (once, on scroll); everything else
// is drawn static.

const POPPINS = { fontFamily: "Poppins, sans-serif" } as const;
const FOCUS =
  "rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c0a84f]";

function Mark({
  children,
  kind = "highlight",
  dark = false,
  animate = false,
}: {
  children: React.ReactNode;
  kind?: "highlight" | "strike";
  dark?: boolean;
  animate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const drawn = !animate || reduce || inView;

  const height = kind === "strike" ? "2px" : dark ? "22%" : "40%";
  const position = kind === "strike" ? "0 58%" : "0 90%";
  const color =
    kind === "strike"
      ? "linear-gradient(#c0a84f, #c0a84f)"
      : dark
        ? "linear-gradient(90deg, #c0a84f, #d4bc72)"
        : "linear-gradient(90deg, rgba(212,188,114,0.6), rgba(192,168,79,0.5))";

  return (
    <motion.span
      ref={ref}
      initial={false}
      animate={{ backgroundSize: `${drawn ? 100 : 0}% ${height}` }}
      transition={{ duration: 1, delay: kind === "strike" ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: color,
        backgroundRepeat: "no-repeat",
        backgroundPosition: position,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </motion.span>
  );
}

/** Review text: blank line = new paragraph, [[…]] = highlighted line. */
function ReviewText({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="max-w-[68ch] space-y-3">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>
          {para.split(/\[\[(.+?)\]\]/).map((part, j) =>
            j % 2 === 1 ? (
              <Mark key={j} dark={dark}>
                <span className={dark ? "text-white" : "text-[#0e2b49]"}>{part}</span>
              </Mark>
            ) : (
              part
            ),
          )}
        </p>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Author({ review, dark = false }: { review: TextReview; dark?: boolean }) {
  const meta = [review.course, review.plan].filter(Boolean).join(", ") || "UNIK Academy student";
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#c0a84f] text-sm font-semibold text-[#0e2b49]"
        style={POPPINS}
      >
        {initials(review.name)}
      </div>
      <div className="leading-tight">
        <p className={`text-sm font-semibold ${dark ? "text-white" : "text-[#0e2b49]"}`} style={POPPINS}>
          {review.name}
        </p>
        <p className={`mt-1 text-xs ${dark ? "text-white/55" : "text-[#64748B]"}`}>{meta}</p>
      </div>
    </div>
  );
}

function FullReview({ review, dark = false }: { review: TextReview; dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${FOCUS} inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
          dark ? "text-[#d4bc72] hover:text-white" : "text-[#0e2b49] hover:text-[#a08a3a]"
        }`}
      >
        {open ? "Hide full review" : "Read full review"}
        <svg
          aria-hidden
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className={`pt-4 text-[15px] leading-[1.75] ${dark ? "text-white/70" : "text-[#475569]"}`}>
              <ReviewText text={review.review} dark={dark} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Featured review ─────────────────────────────────────────────────────────

function FeaturedReview({ review }: { review: TextReview }) {
  return (
    <article className="rounded-[28px] bg-[#0e2b49] px-6 py-8 shadow-[0_30px_60px_-30px_rgba(14,43,73,0.6)] sm:px-10 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
        <div>
          {/* hanging opening quote, so the text edge stays clean */}
          <blockquote
            className="relative text-[1.65rem] font-semibold leading-[1.3] text-white sm:text-[2.1rem] lg:text-[2.35rem]"
            style={POPPINS}
          >
            <span aria-hidden className="absolute -left-[0.45em] top-0 text-[#c0a84f]">
              &ldquo;
            </span>
            <Mark dark animate>
              {review.headline}&rdquo;
            </Mark>
          </blockquote>
          {review.note && <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{review.note}</p>}
          <div className="mt-8">
            <Author review={review} dark />
          </div>
        </div>

        {review.beforeNow && (
          <dl className="grid content-center gap-6 border-white/10 lg:border-l lg:pl-12">
            <div>
              <dt className="text-sm font-medium text-white/45">Then</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-white/45">
                <Mark kind="strike" animate>
                  {review.beforeNow.before}
                </Mark>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[#d4bc72]">Now</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-white">{review.beforeNow.now}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <FullReview review={review} dark />
      </div>
    </article>
  );
}

// ─── Other reviews ───────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: TextReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#0e2b49]/10 bg-white px-6 py-7 sm:px-8 sm:py-9">
      <blockquote className="relative text-lg font-semibold leading-snug text-[#0e2b49] sm:text-xl" style={POPPINS}>
        <span aria-hidden className="absolute -left-[0.5em] top-0 text-[#c0a84f]">
          &ldquo;
        </span>
        <Mark>{review.headline}&rdquo;</Mark>
      </blockquote>
      <div className="mt-6">
        <FullReview review={review} />
      </div>
      <div className="mt-auto pt-8">
        <Author review={review} />
      </div>
    </article>
  );
}

function ReviewPlaceholder() {
  return (
    <div className="flex h-full flex-col justify-end rounded-2xl bg-[#0e2b49]/[0.04] px-6 py-7 sm:px-8 sm:py-9">
      <p className="text-lg font-semibold leading-snug text-[#0e2b49]" style={POPPINS}>
        One more review is on its way.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
        We add new reviews as students finish their courses.
      </p>
    </div>
  );
}

// ─── Video reviews (YouTube Shorts) ──────────────────────────────────────────

const PLAY_PATH = "M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z";

function VideoCard({ video }: { video: VideoReview }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(video.youtube);
  if (!id) return <VideoPlaceholder />;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-[#0e2b49]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title={`Video review by ${video.name}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video review by ${video.name}`}
          className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#c0a84f]"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0e2b49] via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0e2b49] shadow-lg transition-transform duration-200 group-hover:scale-105">
            <svg aria-hidden className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d={PLAY_PATH} />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-left">
            <span className="block text-base font-semibold text-white" style={POPPINS}>
              {video.name}
            </span>
            {(video.caption || video.course) && (
              <span className="mt-0.5 block text-xs text-white/70">{video.caption ?? video.course}</span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div
      aria-hidden
      className="flex aspect-[9/16] w-full items-center justify-center rounded-[22px] border border-[#0e2b49]/10 bg-white"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c0a84f]/50 text-[#c0a84f]">
        <svg className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d={PLAY_PATH} />
        </svg>
      </span>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function ReviewsSection() {
  const [featured, ...rest] = TEXT_REVIEWS;
  const videosPending = VIDEO_REVIEWS.some((v) => !v || !youtubeId(v.youtube));

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12">
          <h2
            id="reviews-heading"
            className="text-balance text-3xl font-bold leading-[1.15] text-[#0e2b49] md:text-[2.75rem]"
            style={POPPINS}
          >
            Don&apos;t take our word for it. Take theirs.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-[#64748B] md:justify-self-end">
            Every review here is unedited. The words are our students&apos;; the gold highlights are ours.
          </p>
        </header>

        <div className="space-y-5">
          {featured ? <FeaturedReview review={featured} /> : <ReviewPlaceholder />}
          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-5">
              {rest.map((r, i) => (
                <div key={i} className={r ? "md:col-span-3" : "md:col-span-2"}>
                  {r ? <ReviewCard review={r} /> : <ReviewPlaceholder />}
                </div>
              ))}
            </div>
          )}
        </div>

        {VIDEO_REVIEWS.length > 0 && (
          <div className="mt-20 md:mt-24">
            <div className="mb-8 max-w-xl">
              <h3 className="text-2xl font-bold text-[#0e2b49] md:text-3xl" style={POPPINS}>
                Hear them speak.
              </h3>
              <p className="mt-3 leading-relaxed text-[#64748B]">
                The real test of a communication course is how its students talk.
                {videosPending && " Our students are recording their video reviews now. They'll appear here as they come in."}
              </p>
            </div>

            {/* swipeable row on phones, grid from md */}
            <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:max-w-3xl md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
              {VIDEO_REVIEWS.map((v, i) => (
                // empty frames stay small on phones so they don't fill the screen
                <div
                  key={i}
                  className={`flex-shrink-0 snap-start md:w-auto ${v ? "w-[62%] sm:w-[40%]" : "w-[38%] sm:w-[28%]"}`}
                >
                  {v ? <VideoCard video={v} /> : <VideoPlaceholder />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 flex flex-col items-start gap-5 border-t border-[#0e2b49]/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-semibold text-[#0e2b49]" style={POPPINS}>
            Your story could be next.
          </p>
          <OpenDemoPopupButton className="rounded-full bg-[#0e2b49] px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#133a67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c0a84f]">
            Book a free demo
          </OpenDemoPopupButton>
        </div>
      </div>
    </section>
  );
}
