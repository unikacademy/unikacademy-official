const PANELS = [
  {
    word: "Speak",
    headline: "Find Your Voice",
    body: "Break through silence. Say what you mean with clarity, conviction, and confidence that commands attention.",
    num: "01",
  },
  {
    word: "Lead",
    headline: "Command Any Room",
    body: "Boardrooms, stages, conversations — lead with a presence that people feel and never forget.",
    num: "02",
  },
  {
    word: "Transform",
    headline: "Become Unstoppable",
    body: "From hesitant to magnetic. Join 500+ students who've completely rewritten their story.",
    num: "03",
  },
];

export default function JourneySection() {
  return (
    <section className="bg-[#0e2b49] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {PANELS.map((panel, i) => (
            <div
              key={i}
              className="px-0 md:px-10 py-10 md:py-0 first:pl-0 last:pr-0"
            >
              <p className="text-[#c0a84f]/50 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                {panel.num}
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {panel.word}
              </h2>
              <div className="w-10 h-[2px] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-4" />
              <h3 className="text-base font-semibold text-[#c0a84f] mb-2">
                {panel.headline}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {panel.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
