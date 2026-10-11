"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, SendHorizontal, X } from "lucide-react";
import { getBotReply } from "../mock";
import { SUGGESTED_QUESTIONS, type ChatMessage } from "../types";
import LeadForm from "./LeadForm";

const MAX_INPUT_LENGTH = 500;

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hi! I'm the Unik Academy assistant. Ask me about our courses, fees or the free demo.",
};

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0e2b49]/40"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_INPUT_LENGTH);
      if (!text || typing) return;

      setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
      setInput("");
      setTyping(true);
      try {
        const reply = await getBotReply(text);
        setMessages((m) => [...m, { id: nextId(), role: "bot", ...reply }]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: "bot",
            text: "Sorry, something went wrong. Please try again, or book a free demo and our team will reach out.",
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [typing],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleLeadDone = (firstName: string) => {
    setMessages((m) => [
      ...m,
      {
        id: nextId(),
        role: "bot",
        text: `Thanks, ${firstName}! Our team will contact you shortly to schedule your free demo.`,
      },
    ]);
  };

  const showSuggestions = messages.length === 1 && !typing;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Unik Academy assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[min(34rem,calc(100dvh-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_20px_60px_rgba(14,43,73,0.25)] sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[24rem]"
          >
            <header className="flex items-center gap-3 bg-[#0e2b49] px-4 py-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c0a84f] text-[#0e2b49]">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">Unik Academy</p>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Ask us anything
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={
                        m.role === "user"
                          ? "rounded-2xl rounded-br-md bg-[#0e2b49] px-3.5 py-2.5 text-sm text-white"
                          : "rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm"
                      }
                    >
                      {m.text}
                    </div>
                    {m.leadForm && <LeadForm onDone={handleLeadDone} />}
                  </div>
                </div>
              ))}

              {typing && <TypingIndicator />}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(q)}
                      className="rounded-full border border-[#0e2b49]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#0e2b49] transition hover:border-[#c0a84f] hover:bg-[#c0a84f]/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_INPUT_LENGTH}
                placeholder="Type your question…"
                aria-label="Your message"
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#c0a84f] focus:bg-white focus:ring-2 focus:ring-[#c0a84f]/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0e2b49] text-white transition hover:bg-[#133a67] disabled:opacity-40"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with us"
          className="fixed right-4 bottom-40 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0e2b49] text-white shadow-[0_8px_32px_rgba(14,43,73,0.4)] transition hover:scale-105 hover:bg-[#133a67] active:scale-95 sm:right-6 sm:bottom-24"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
