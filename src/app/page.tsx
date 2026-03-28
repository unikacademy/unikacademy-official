import Link from "next/link";

export default function Home() {
  const courses = [
    {
      title: "Communication Skills",
      description: "Master the art of effective communication in personal and professional settings.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
    },
    {
      title: "Business Communication",
      description: "Master professional business communication for meetings, emails, and executive interactions.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>,
    },
    {
      title: "Public Speaking & Presentation",
      description: "Build unshakeable confidence and excel on any stage or boardroom.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    },
    {
      title: "Spoken English & Grammar",
      description: "Enhance English fluency, grammar precision, and articulate expression.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    },
    {
      title: "Personality Development",
      description: "Transform your personality, leadership presence, and interpersonal influence.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    },
    {
      title: "Basic Communication",
      description: "Start your journey with foundational communication skills for everyday confidence.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>,
    },
    {
      title: "Intermediate Communication",
      description: "Level up with advanced techniques for professional and social settings.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    },
    {
      title: "Advanced Communication",
      description: "Master high-impact communication for leadership, negotiations, and executive presence.",
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    },
  ];

  const coursePricing = [
    {
      title: "Basic Communication",
      price: "1,000",
      description: "Perfect for beginners looking to build foundational communication skills.",
      features: ["Core communication basics", "Beginner-friendly", "100% Live classes", "Weekend classes available", "Certificate"],
    },
    {
      title: "Intermediate Communication",
      price: "2,000",
      description: "For those ready to refine and elevate their communication in professional contexts.",
      features: ["Advanced techniques", "Professional scenarios", "100% Live classes", "Weekend classes available", "Certificate"],
    },
    {
      title: "Advanced Communication",
      price: "3,000",
      description: "Executive-level mastery for leaders and high-performers.",
      features: ["Leadership communication", "Negotiation skills", "100% Live classes", "Weekend classes available", "Certificate"],
      featured: true,
    },
  ];

  const premiumPlans = [
    {
      subtitle: "1-on-5",
      price: "6,000",
      description: "Interactive group learning with peer engagement and collaborative exercises.",
      features: ["60 Live sessions", "Up to 5 students", "Group activities", "Weekend classes available", "100% Live — no recordings"],
      featured: false,
    },
    {
      subtitle: "1-on-2",
      price: "9,000",
      description: "Focused small-group sessions with maximum personalized attention.",
      features: ["60 Live sessions", "2 students", "Personalized focus", "Weekend classes available", "100% Live — no recordings"],
      featured: true,
    },
    {
      subtitle: "1-on-1",
      price: "12,000",
      description: "Exclusive one-on-one coaching tailored entirely to your goals.",
      features: ["60 Live sessions", "Solo sessions", "Custom curriculum", "Weekend classes available", "100% Live — no recordings"],
      featured: false,
    },
  ];

  const stats = [
    { value: "500+", label: "Students Trained" },
    { value: "8", label: "Core Courses" },
    { value: "3", label: "Session Formats" },
    { value: "100%", label: "Dedicated Support" },
  ];

  const benefits = [
    "Expert instructors with years of experience",
    "Personalized attention in every format",
    "Practical, hands-on learning approach",
    "Flexible scheduling to fit your life",
    "Comprehensive curriculum & materials",
    "Affordable pricing for every budget",
  ];

  return (
    <div className="min-h-screen">

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-[#0e2b49] text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c0a84f]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#133a67]/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/30 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0a84f] animate-pulse" />
              Premier Communication Academy
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              <span className="text-white">UNIK</span>{" "}
              <span style={{ background: "linear-gradient(135deg, #c0a84f, #d4bc72, #c0a84f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Academy
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              Empowering Communication.{" "}
              <span className="text-[#c0a84f] font-semibold">Transforming Personalities.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.35)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.5)] hover:-translate-y-0.5 cursor-pointer text-base">
                Start Your Journey
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/8 transition-all duration-200 cursor-pointer text-base">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60L1440 60L1440 20C1320 50 1200 60 1080 50C960 40 840 0 720 0C600 0 480 40 360 50C240 60 120 50 0 20L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="bg-[#F8FAFC] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-md hover:border-[#c0a84f]/30 transition-all duration-200">
                <div className="text-3xl font-bold text-[#0e2b49] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</div>
                <div className="text-sm text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Our Core Courses</h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mb-5" />
            <p className="text-[#64748B] max-w-xl mx-auto text-lg">Comprehensive programs designed to unlock your full communication potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#c0a84f]/40 hover:shadow-[0_8px_32px_rgba(14,43,73,0.1)] transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0e2b49]/8 to-[#133a67]/12 flex items-center justify-center text-[#0e2b49] mb-4 group-hover:from-[#c0a84f]/15 group-hover:to-[#d4bc72]/20 group-hover:text-[#c0a84f] transition-all duration-300">
                  {course.icon}
                </div>
                <h3 className="text-base font-semibold text-[#0e2b49] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{course.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Course Pricing Section ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">Affordable Plans</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Beginner-Friendly Pricing</h2>
            <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mx-auto mb-5" />
            <p className="text-[#64748B] max-w-xl mx-auto text-lg">Start small, grow big — accessible plans designed for anyone beginning their communication journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {coursePricing.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${plan.featured ? "bg-gradient-to-br from-[#0e2b49] to-[#133a67] text-white shadow-[0_20px_60px_rgba(14,43,73,0.3)] scale-105" : "bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#c0a84f]/30 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)]"}`}>
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] shadow-lg whitespace-nowrap">Most Popular</span>
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-4 ${plan.featured ? "text-white" : "text-[#0e2b49]"}`} style={{ fontFamily: "Poppins, sans-serif" }}>{plan.title}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-sm font-medium ${plan.featured ? "text-white/60" : "text-[#64748B]"}`}>₹</span>
                  <span className={`text-5xl font-bold ${plan.featured ? "text-white" : "text-[#0e2b49]"}`} style={{ fontFamily: "Poppins, sans-serif" }}>{plan.price}</span>
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${plan.featured ? "text-white/65" : "text-[#64748B]"}`}>{plan.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.featured ? "bg-[#c0a84f]/25" : "bg-[#c0a84f]/15"}`}>
                        <svg className="w-2.5 h-2.5 text-[#c0a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className={`text-sm ${plan.featured ? "text-white/80" : "text-[#475569]"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${plan.featured ? "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] shadow-lg" : "border-2 border-[#0e2b49] text-[#0e2b49] hover:bg-[#0e2b49] hover:text-white"}`}>
                  Enroll Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">Why UNIK</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0e2b49] mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>The UNIK Difference</h2>
              <div className="w-14 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-7" />
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                We believe strong communication is the foundation of every success story. Our proven approach combines expert instruction with practical application.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-[#0e2b49]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-[#475569] text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0e2b49] to-[#133a67] rounded-3xl p-8 text-white shadow-2xl">
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#c0a84f]/20 rounded-full blur-xl" />
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#0e2b49]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Transform Your Future</h3>
                  <p className="text-white/65 text-sm leading-relaxed">From hesitant speakers to confident communicators — our students achieve remarkable transformations.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[{ n: "Expert", sub: "Instructors" }, { n: "Proven", sub: "Curriculum" }, { n: "Flexible", sub: "Scheduling" }, { n: "Result", sub: "Oriented" }].map((item, i) => (
                    <div key={i} className="bg-white/8 rounded-xl p-3.5 border border-white/10">
                      <div className="text-[#c0a84f] font-bold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{item.n}</div>
                      <div className="text-white/55 text-xs mt-0.5">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Premium Plans Section ─── */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg, #0a1f38 0%, #0e2b49 50%, #112d52 100%)" }}>
        {/* Background dot pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        {/* Glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c0a84f]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              Premium Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Pick Your{" "}
              <span style={{ background: "linear-gradient(135deg, #c0a84f, #d4bc72)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Session Format
              </span>
            </h2>
            <div className="w-14 h-1 rounded-full mx-auto mb-5" style={{ background: "linear-gradient(90deg, #c0a84f, #d4bc72)" }} />
            <p className="text-white/60 max-w-xl mx-auto text-lg">60 live sessions per plan — choose how you learn best.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto items-center">
            {premiumPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.featured
                  ? "bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] shadow-[0_24px_64px_rgba(192,168,79,0.4)] scale-105"
                  : "bg-white/6 border border-white/12 hover:border-[#c0a84f]/50 hover:bg-white/10 backdrop-blur-sm"
              }`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-5 py-1.5 rounded-full text-xs font-bold bg-[#0e2b49] text-[#c0a84f] shadow-xl whitespace-nowrap tracking-wide uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Subtitle */}
                <div className="mb-5">
                  <h3 className={`text-4xl font-bold mb-0.5 ${plan.featured ? "text-[#0e2b49]" : "text-[#c0a84f]"}`} style={{ fontFamily: "Poppins, sans-serif" }}>
                    {plan.subtitle}
                  </h3>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${plan.featured ? "text-[#0e2b49]/60" : "text-white/40"}`}>session format</p>
                </div>

                {/* Price */}
                <div className={`flex items-baseline gap-1 mb-5 pb-5 border-b ${plan.featured ? "border-[#0e2b49]/15" : "border-white/10"}`}>
                  <span className={`text-lg font-semibold ${plan.featured ? "text-[#0e2b49]/70" : "text-white/60"}`}>₹</span>
                  <span className={`text-5xl font-bold ${plan.featured ? "text-[#0e2b49]" : "text-white"}`} style={{ fontFamily: "Poppins, sans-serif" }}>{plan.price}</span>
                </div>

                <p className={`text-sm leading-relaxed mb-6 ${plan.featured ? "text-[#0e2b49]/70" : "text-white/55"}`}>{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? "bg-[#0e2b49]/15" : "bg-[#c0a84f]/20"}`}>
                        <svg className={`w-3 h-3 ${plan.featured ? "text-[#0e2b49]" : "text-[#c0a84f]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className={`text-sm font-medium ${plan.featured ? "text-[#0e2b49]" : "text-white/75"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className={`block w-full text-center py-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  plan.featured
                    ? "bg-[#0e2b49] text-[#c0a84f] hover:bg-[#133a67] shadow-lg"
                    : "bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] text-[#0e2b49] hover:from-[#d4bc72] hover:to-[#c0a84f] shadow-[0_4px_20px_rgba(192,168,79,0.3)] hover:shadow-[0_8px_28px_rgba(192,168,79,0.5)]"
                }`}>
                  Enroll Now
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom trust line */}
          <p className="text-center text-white/35 text-sm mt-10">
            All plans include 60 live sessions &bull; Weekend classes available &bull; No recorded classes
          </p>
        </div>
      </section>

      {/* ─── Free Demo Section ─── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e2b49] to-[#133a67] px-8 py-14 md:px-16 shadow-[0_24px_64px_rgba(14,43,73,0.2)]">
            {/* Background dots */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            {/* Glow */}
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#c0a84f]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 text-[#c0a84f] text-xs font-semibold uppercase tracking-widest mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#c0a84f] animate-pulse" />
                  100% Free — No Commitment
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Book Your{" "}
                  <span style={{ background: "linear-gradient(135deg, #c0a84f, #d4bc72)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Free Demo
                  </span>{" "}
                  Session
                </h2>
                <p className="text-white/65 text-lg leading-relaxed mb-8">
                  Not sure where to start? Experience our teaching style first-hand with a free 30-minute live demo session — no payment, no pressure.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: "🎯", text: "Personalized session just for you" },
                    { icon: "⏱", text: "30 minutes, live & interactive" },
                    { icon: "💸", text: "Completely free, no hidden fees" },
                    { icon: "📅", text: "Flexible — pick your time slot" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-xl px-4 py-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-white/75 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.4)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.55)] hover:-translate-y-0.5 cursor-pointer text-base"
                >
                  Book Free Demo Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Right — visual card */}
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white/8 border border-white/15 rounded-2xl p-8 w-full max-w-sm backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-[#0e2b49]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>Demo Session</p>
                      <p className="text-white/50 text-xs">Live &bull; 1-on-1 &bull; 30 min</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["Meet your instructor", "Understand your goals", "Get a learning roadmap", "Ask any questions"].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#c0a84f]/20 border border-[#c0a84f]/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#c0a84f] text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-white/70 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/50 text-sm">Session fee</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 line-through text-sm">₹500</span>
                      <span className="text-[#c0a84f] font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden py-24 bg-[#0e2b49]">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-4">Get Started Today</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Ready to Transform Your{" "}
            <span style={{ background: "linear-gradient(135deg, #c0a84f, #d4bc72)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Communication Skills?
            </span>
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join UNIK Academy and take the first step towards personal and professional excellence. Your transformation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-semibold text-[#0e2b49] bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] hover:from-[#d4bc72] hover:to-[#c0a84f] transition-all duration-200 shadow-[0_4px_24px_rgba(192,168,79,0.35)] hover:shadow-[0_8px_32px_rgba(192,168,79,0.5)] hover:-translate-y-0.5 cursor-pointer text-base">
              Contact Us Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/8 transition-all duration-200 cursor-pointer text-base">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
