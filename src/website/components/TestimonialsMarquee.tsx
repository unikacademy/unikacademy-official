"use client";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    initials: "PS",
    avatarFrom: "#c0a84f",
    avatarTo: "#d4bc72",
    course: "Communication Skills",
    city: "Delhi",
    rating: 5,
    review:
      "My confidence in meetings has completely transformed. Before UNIK, I avoided speaking up. Now I lead team discussions and present to senior management.",
  },
  {
    name: "Rahul Verma",
    initials: "RV",
    avatarFrom: "#0e2b49",
    avatarTo: "#133a67",
    course: "Public Speaking",
    city: "Mumbai",
    rating: 5,
    review:
      "I used to freeze during presentations. After 8 weeks with UNIK, I gave a TEDx talk at my college. The instructor's personalised feedback made all the difference.",
  },
  {
    name: "Anjali Mehta",
    initials: "AM",
    avatarFrom: "#c0a84f",
    avatarTo: "#0e2b49",
    course: "Spoken English",
    city: "Pune",
    rating: 5,
    review:
      "My spoken English improved so much in just 6 weeks. My manager noticed the change immediately and praised me in front of the whole team.",
  },
  {
    name: "Vikram Singh",
    initials: "VS",
    avatarFrom: "#133a67",
    avatarTo: "#c0a84f",
    course: "Personality Development",
    city: "Jaipur",
    rating: 5,
    review:
      "This course changed how I carry myself entirely. I attended three job interviews after the course and got offers from all three.",
  },
  {
    name: "Sneha Patel",
    initials: "SP",
    avatarFrom: "#c0a84f",
    avatarTo: "#133a67",
    course: "Business Communication",
    city: "Ahmedabad",
    rating: 5,
    review:
      "Got promoted within 3 months of completing the course. My boss specifically said my communication skills stood out during the review.",
  },
  {
    name: "Arjun Nair",
    initials: "AN",
    avatarFrom: "#0e2b49",
    avatarTo: "#c0a84f",
    course: "Communication Skills",
    city: "Bangalore",
    rating: 5,
    review:
      "I went from being the quietest person in the room to someone others come to for communication advice. The 1-on-1 sessions are incredibly effective.",
  },
];

const STARS = Array.from({ length: 5 });

function TestimonialCard({
  t,
}: {
  t: (typeof TESTIMONIALS)[0];
}) {
  return (
    <div
      className="flex-shrink-0 w-[320px] bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm mx-3"
      aria-label={`Testimonial from ${t.name}`}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4" aria-hidden="true">
        {STARS.map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-[#c0a84f]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review */}
      <p className="text-[#475569] text-sm leading-relaxed mb-5 italic line-clamp-3">
        &ldquo;{t.review}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${t.avatarFrom}, ${t.avatarTo})`,
          }}
          aria-hidden="true"
        >
          {t.initials}
        </div>
        <div>
          <p
            className="text-[#0e2b49] font-semibold text-sm"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t.name}
          </p>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            {t.course} · {t.city}
          </p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof TESTIMONIALS;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex"
        style={{
          animation: `${reverse ? "marqueeRight" : "marqueeLeft"} ${items.length * 5}s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  const row1 = TESTIMONIALS.slice(0, 4);
  const row2 = TESTIMONIALS.slice(2, 6);

  return (
    <section
      className="py-16 md:py-24 bg-[#F8FAFC] overflow-hidden"
      aria-label="Student testimonials"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center">
        <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
          Student Stories
        </p>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0e2b49] mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Real Results.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Real Students.
          </span>
        </h2>
        <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mb-6" />
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
          Hundreds of students across India have transformed their communication
          with UNIK Academy.
        </p>

        {/* Quick stats */}
        <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
          {[
            { value: "500+", label: "Students Trained" },
            { value: "4.9★", label: "Average Rating" },
            { value: "95%", label: "Recommend Us" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] rounded-full px-5 py-2 shadow-sm"
            >
              <span
                className="text-[#c0a84f] font-bold text-base"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.value}
              </span>
              <span className="text-[#64748B] text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-5">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </section>
  );
}
