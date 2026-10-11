"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "@/shared/validation";
import { submitLead } from "../mock";

type Field = "name" | "phone" | "email";
type Errors = Partial<Record<Field, string>>;

const FIELDS: { key: Field; label: string; type: string; autoComplete: string; placeholder: string }[] = [
  { key: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "10-digit mobile number" },
  { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
];

export default function LeadForm({ onDone }: { onDone: (name: string) => void }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: validateName(values.name) ?? undefined,
      phone: validatePhone(values.phone) ?? undefined,
      email: validateEmail(values.email) ?? undefined,
    };
    setErrors(next);
    if (next.name || next.phone || next.email) return;

    setSubmitting(true);
    try {
      await submitLead(values);
      setDone(true);
      onDone(values.name.trim().split(/\s+/)[0]);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Details received. We&apos;ll be in touch shortly.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-2 space-y-2.5 rounded-xl border border-[#0e2b49]/10 bg-white p-3 shadow-sm"
    >
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label
            htmlFor={`chat-lead-${f.key}`}
            className="mb-1 block text-xs font-medium text-[#0e2b49]/70"
          >
            {f.label}
          </label>
          <input
            id={`chat-lead-${f.key}`}
            type={f.type}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            value={values[f.key]}
            onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            aria-invalid={!!errors[f.key]}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#c0a84f] focus:bg-white focus:ring-2 focus:ring-[#c0a84f]/30 aria-invalid:border-red-400"
          />
          {errors[f.key] && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors[f.key]}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0e2b49] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#133a67] disabled:opacity-70"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Book my free demo
      </button>
    </form>
  );
}
