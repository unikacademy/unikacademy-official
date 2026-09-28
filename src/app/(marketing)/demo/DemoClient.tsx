"use client";

import { useState } from "react";
import { DEMO_ORIGINAL_PRICE } from "@/modules/courses/constants";
import DemoBookingForm, {
  type BookingType,
} from "@/modules/demo-bookings/components/DemoBookingForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";

const BOOKING_FORM_OFFSET = -80; // clears the sticky nav (h-16) + breathing room

const steps = [
  {
    num: "1",
    title: "Meet Your Instructor",
    desc: "Get introduced to your personal trainer and understand the teaching style.",
  },
  {
    num: "2",
    title: "Share Your Goals",
    desc: "Tell us where you are now and where you want to be.",
  },
  {
    num: "3",
    title: "Get Your Roadmap",
    desc: "Receive a customized learning plan tailored to your needs.",
  },
  {
    num: "4",
    title: "Ask Anything",
    desc: "Clear all your doubts about courses, schedules, and pricing.",
  },
];

const courses = [
  "Communication Skills",
  "Public Speaking & Presentation",
  "Spoken English & Grammar",
  "Personality Development",
];

const corporateCourses = [
  "Corporate Communication Training",
  "Team Communication Workshop",
  "Business Etiquette & Soft Skills",
  "Leadership Communication",
  "Public Speaking for Teams",
  "Custom Training Program",
];

const faqs = [
  {
    q: "Who is the demo session for?",
    a: "Anyone who wants to improve their communication, spoken English, public speaking, or personality. Whether you are a student, working professional, or homemaker — our demo is open to all.",
  },
  {
    q: "Do I need to pay anything for the demo?",
    a: "Absolutely not. The demo session is 100% free with no hidden charges and zero commitment to enroll afterwards.",
  },
  {
    q: "How will UNIK Academy contact me after I submit the form?",
    a: "We will reach out via phone or WhatsApp within 24 hours to confirm your slot and share the session link.",
  },
  {
    q: "Is the session online or in-person?",
    a: "The demo is conducted online via video call, so you can join from anywhere in India — no travel needed.",
  },
  {
    q: "What happens after the demo?",
    a: "After your demo session, you will receive a personalised course recommendation and pricing details. There is no pressure to enroll — you decide at your own pace.",
  },
];

export default function DemoPage() {
  const [bookingType, setBookingType] = useState<BookingType>("individual");

  const scrollToBookingForm = () => {
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo("#book-demo", {
        offset: BOOKING_FORM_OFFSET,
      });
    } else {
      document
        .getElementById("book-demo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[#0e2b49] text-white py-20">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0a84f]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#133a67]/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="h-auto gap-2 rounded-full border border-[#c0a84f]/40 bg-[#c0a84f]/10 px-4 py-1.5 text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c0a84f] animate-pulse" />
            100% Free — No Commitment
          </Badge>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Book Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c0a84f, #d4bc72)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Free Demo
            </span>{" "}
            Session
          </h1>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto">
            Experience our teaching style first-hand with a free 30-minute live
            session no payment, no pressure, just learning.
          </p>

          <Button
            type="button"
            onClick={scrollToBookingForm}
            className="h-auto mt-8 gap-2 rounded-xl bg-linear-to-r from-[#c0a84f] to-[#d4bc72] px-8 py-4 text-base font-bold text-[#0e2b49] shadow-[0_4px_24px_rgba(192,168,79,0.4)] hover:from-[#d4bc72] hover:to-[#c0a84f] hover:shadow-[0_8px_32px_rgba(192,168,79,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Book Your Free Demo Session
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Button>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { value: "30 min", label: "Live session" },
              { value: "1-on-1", label: "Personal attention" },
              { value: "FREE", label: "No hidden charges" },
              { value: "Flexible", label: "Pick your slot" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/8 border border-white/12 rounded-xl px-5 py-3 text-center min-w-[110px]"
              >
                <div
                  className="text-[#c0a84f] font-bold text-lg"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50L1440 50L1440 15C1320 40 1200 50 1080 40C960 30 840 0 720 0C600 0 480 30 360 40C240 50 120 40 0 15L0 50Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* ─── What Happens in the Demo ─── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              What to Expect
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Your 30-Minute Demo Journey
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card
                key={step.num}
                className="[--card-spacing:1.5rem] gap-0 rounded-2xl border border-[#E2E8F0] bg-white ring-0 hover:border-[#c0a84f]/40 hover:shadow-[0_8px_32px_rgba(14,43,73,0.08)] transition-all duration-200"
              >
                <CardContent>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c0a84f] to-[#d4bc72] flex items-center justify-center mb-4 shadow-md">
                    <span
                      className="text-[#0e2b49] font-bold text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <CardTitle
                    className="mb-2 text-sm font-semibold text-[#0e2b49]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-[#64748B]">
                    {step.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Form + Info ─── */}
      <section id="book-demo" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left info */}
            <div>
              <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
                Why Book a Demo
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0e2b49] mb-5"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Try Before You Enroll
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[#c0a84f] to-[#d4bc72] rounded-full mb-6" />
              <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                We believe you should feel confident before committing. Our free
                demo lets you experience the quality of our teaching, ask all
                your questions, and decide if UNIK Academy is the right fit for
                you.
              </p>
              <ItemGroup className="gap-4">
                {[
                  {
                    title: "No payment required",
                    desc: "The demo session is completely free — forever.",
                  },
                  {
                    title: "Live, not recorded",
                    desc: "Every demo is a real-time interactive session with an instructor.",
                  },
                  {
                    title: "Tailored to you",
                    desc: "We design the demo around your specific goals and course interest.",
                  },
                  {
                    title: "Weekend slots available",
                    desc: "Choose a time that works for your schedule.",
                  },
                ].map((item, i) => (
                  <Item
                    key={i}
                    className="items-start gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                  >
                    <ItemMedia className="mt-0.5 h-8 w-8 rounded-full bg-gradient-to-br from-[#c0a84f] to-[#d4bc72]">
                      <svg
                        className="w-4 h-4 text-[#0e2b49]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle
                        className="text-sm font-semibold text-[#0e2b49]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.title}
                      </ItemTitle>
                      <ItemDescription className="text-sm text-[#64748B]">
                        {item.desc}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>

              {/* Price callout */}
              <div className="mt-8 flex items-center gap-4 bg-gradient-to-r from-[#0e2b49] to-[#133a67] rounded-2xl p-5">
                <div className="flex-shrink-0">
                  <div className="text-white/40 text-sm line-through">{DEMO_ORIGINAL_PRICE}</div>
                  <div
                    className="text-[#c0a84f] font-bold text-3xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    FREE
                  </div>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <p className="text-white font-semibold text-sm">
                    Demo Session
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    30 min &bull; Live &bull; 1-on-1 &bull; No commitment
                  </p>
                </div>
              </div>
            </div>

            {/* Right form */}
            <Card className="[--card-spacing:2rem] gap-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] ring-0">
              <CardHeader>
                <CardTitle
                  className="text-2xl font-bold text-[#0e2b49]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {bookingType === "corporate"
                    ? "Book Corporate Training"
                    : "Book Your Slot"}
                </CardTitle>
                <CardDescription className="text-sm text-[#64748B]">
                  {bookingType === "corporate"
                    ? "Tell us about your company and we'll design a training plan for your team."
                    : "Fill in your details and we'll reach out to confirm your demo session."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DemoBookingForm
                  variant="light"
                  idPrefix="demo"
                  courseOptions={{ individual: courses, corporate: corporateCourses }}
                  onBookingTypeChange={setBookingType}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* ─── FAQ ─── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-[#c0a84f] uppercase tracking-widest mb-3">
              Got Questions?
            </p>
            <h2
              className="text-3xl font-bold text-[#0e2b49]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-[#E2E8F0]"
              >
                <AccordionTrigger
                  className="py-5 text-[#0e2b49] font-semibold text-sm hover:no-underline"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#64748B] text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
