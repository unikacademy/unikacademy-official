"use client";

import { useState, type SubmitEvent } from "react";
import { CheckIcon } from "lucide-react";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateCompanyName,
} from "@/shared/validation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export type BookingType = "individual" | "corporate";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

// Only the color/contrast classes differ between hosts — every field,
// validation rule, and submit behavior below is shared identically.
const VARIANT_STYLES = {
  light: {
    label: "text-xs font-semibold text-[#0e2b49]",
    input:
      "h-auto rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50",
    select:
      "h-auto w-full justify-between rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] data-placeholder:text-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50",
    textarea:
      "min-h-[88px] rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0e2b49] placeholder-[#94a3b8] focus-visible:border-[#c0a84f] focus-visible:ring-[#c0a84f]/50",
    toggleTrack: "grid w-full grid-cols-2 gap-1 rounded-xl bg-[#E2E8F0]/60 p-1",
    toggleItem:
      "h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-[#64748B] hover:bg-transparent hover:text-[#0e2b49] data-pressed:bg-white data-pressed:text-[#0e2b49] data-pressed:shadow-sm",
    alert: "border-red-100 bg-red-50 px-4 py-2.5",
    alertText: "text-red-500 text-xs",
    helperText: "text-center text-[#94a3b8] text-[11px]",
    emptyTitle: "text-lg font-bold text-[#0e2b49]",
    emptyDescription: "text-[#64748B] text-sm",
  },
  dark: {
    label:
      "text-[11px] font-semibold text-white/50 uppercase tracking-widest",
    input:
      "h-auto rounded-xl border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/25 focus-visible:border-[#c0a84f]/50 focus-visible:ring-[#c0a84f]/20",
    select:
      "h-auto w-full justify-between rounded-xl border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white data-placeholder:text-white/25 focus-visible:border-[#c0a84f]/50 focus-visible:ring-[#c0a84f]/20",
    textarea:
      "min-h-[88px] rounded-xl border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/25 focus-visible:border-[#c0a84f]/50 focus-visible:ring-[#c0a84f]/20",
    toggleTrack: "grid w-full grid-cols-2 gap-1 rounded-xl bg-white/10 p-1",
    toggleItem:
      "h-auto rounded-lg border-none bg-transparent px-2.5 py-2 text-sm font-semibold text-white/50 hover:bg-transparent hover:text-white data-pressed:bg-white/15 data-pressed:text-white data-pressed:shadow-sm",
    alert: "border-red-400/30 bg-red-500/10 px-4 py-2.5",
    alertText: "text-red-300 text-xs",
    helperText: "text-center text-white/40 text-[11px]",
    emptyTitle: "text-lg font-bold text-white",
    emptyDescription: "text-white/50 text-sm",
  },
} as const;

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  companyName: "",
  course: "Quick Demo Request",
  message: "",
  companySize: "",
  participants: "",
  preferredDate: "",
};

export default function DemoBookingForm({
  variant = "light",
  idPrefix = "demo",
  initialBookingType = "individual",
  onSuccess,
  className,
  courseOptions,
  onBookingTypeChange,
}: {
  variant?: keyof typeof VARIANT_STYLES;
  idPrefix?: string;
  initialBookingType?: BookingType;
  onSuccess?: () => void;
  className?: string;
  /**
   * Supplying this switches on the full field set (course/training-
   * requirement select, message, and the extended corporate fields —
   * company size, participants, preferred date). Omit it for the compact
   * quick-book form (popup / hero) that only asks for name + phone
   * (+ company/email for corporate).
   */
  courseOptions?: { individual: string[]; corporate: string[] };
  /** Fired when the user switches the Individual/Corporate toggle, so a
   * host page can mirror the selection (e.g. to change its own heading). */
  onBookingTypeChange?: (type: BookingType) => void;
}) {
  const styles = VARIANT_STYLES[variant];
  const extended = !!courseOptions;

  const [bookingType, setBookingType] =
    useState<BookingType>(initialBookingType);
  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    course: extended ? "" : EMPTY_FORM.course,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    companyName?: string;
    course?: string;
  }>({});

  const handleBookingTypeChange = (type: BookingType) => {
    setBookingType(type);
    onBookingTypeChange?.(type);
    setFormData((prev) => ({
      ...prev,
      email: "",
      companyName: "",
      companySize: "",
      participants: "",
      preferredDate: "",
      // Course lists differ per type, so a selection from one no longer
      // makes sense in the other.
      course: extended ? "" : prev.course,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      email: undefined,
      companyName: undefined,
      course: undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);
    const companyErr =
      bookingType === "corporate"
        ? validateCompanyName(formData.companyName)
        : null;
    const emailErr =
      bookingType === "corporate" ? validateEmail(formData.email) : null;
    const courseErr =
      extended && !formData.course
        ? bookingType === "corporate"
          ? "Please select a training requirement."
          : "Please select a course of interest."
        : null;
    if (nameErr || phoneErr || companyErr || emailErr || courseErr) {
      setFieldErrors({
        name: nameErr ?? undefined,
        phone: phoneErr ?? undefined,
        companyName: companyErr ?? undefined,
        email: emailErr ?? undefined,
        course: courseErr ?? undefined,
      });
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bookingType,
          participants: formData.participants
            ? Number(formData.participants)
            : undefined,
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        onSuccess?.();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <Empty className={cn("p-0 py-6", className)}>
        <EmptyHeader>
          <EmptyMedia className="mb-0 size-14 rounded-full bg-linear-to-br from-[#c0a84f] to-[#d4bc72] shadow-lg [&_svg]:size-7 [&_svg]:text-[#0e2b49]">
            <CheckIcon strokeWidth={2.5} />
          </EmptyMedia>
          <EmptyTitle
            className={styles.emptyTitle}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {bookingType === "corporate"
              ? "Request Received!"
              : "Demo Booked!"}
          </EmptyTitle>
          <EmptyDescription className={styles.emptyDescription}>
            {bookingType === "corporate"
              ? "Our corporate training team will reach out shortly."
              : "We'll reach out on WhatsApp / phone to confirm your slot."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <ToggleGroup
        value={[bookingType]}
        onValueChange={(values) => {
          const next = values[0] as BookingType | undefined;
          if (next) handleBookingTypeChange(next);
        }}
        className={styles.toggleTrack}
      >
        <ToggleGroupItem value="individual" className={styles.toggleItem}>
          Individual
        </ToggleGroupItem>
        <ToggleGroupItem value="corporate" className={styles.toggleItem}>
          Corporate
        </ToggleGroupItem>
      </ToggleGroup>

      {bookingType === "corporate" && (
        <Field data-invalid={!!fieldErrors.companyName}>
          <FieldLabel
            htmlFor={`${idPrefix}-company`}
            className={styles.label}
          >
            Company Name *
          </FieldLabel>
          <Input
            type="text"
            id={`${idPrefix}-company`}
            name="companyName"
            autoComplete="organization"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your company's name"
            className={styles.input}
          />
          <FieldError className="text-xs">
            {fieldErrors.companyName}
          </FieldError>
        </Field>
      )}

      <Field data-invalid={!!fieldErrors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`} className={styles.label}>
          {bookingType === "corporate"
            ? "Contact Person Name *"
            : "Full Name *"}
        </FieldLabel>
        <Input
          type="text"
          id={`${idPrefix}-name`}
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={styles.input}
        />
        <FieldError className="text-xs">{fieldErrors.name}</FieldError>
      </Field>

      <Field data-invalid={!!fieldErrors.phone}>
        <FieldLabel htmlFor={`${idPrefix}-phone`} className={styles.label}>
          Phone Number *
        </FieldLabel>
        <Input
          type="tel"
          id={`${idPrefix}-phone`}
          name="phone"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          className={styles.input}
        />
        <FieldError className="text-xs">{fieldErrors.phone}</FieldError>
      </Field>

      {bookingType === "corporate" && (
        <Field data-invalid={!!fieldErrors.email}>
          <FieldLabel htmlFor={`${idPrefix}-email`} className={styles.label}>
            Business Email *
          </FieldLabel>
          <Input
            type="email"
            id={`${idPrefix}-email`}
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={styles.input}
          />
          <FieldError className="text-xs">{fieldErrors.email}</FieldError>
        </Field>
      )}

      {extended && bookingType === "corporate" && (
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel
              htmlFor={`${idPrefix}-companySize`}
              className={styles.label}
            >
              Company Size
            </FieldLabel>
            <Select
              value={formData.companySize || null}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  companySize: (value as string) ?? "",
                }))
              }
            >
              <SelectTrigger
                id={`${idPrefix}-companySize`}
                className={styles.select}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s} employees
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel
              htmlFor={`${idPrefix}-participants`}
              className={styles.label}
            >
              Participants
            </FieldLabel>
            <Input
              type="number"
              id={`${idPrefix}-participants`}
              name="participants"
              min={1}
              value={formData.participants}
              onChange={handleChange}
              placeholder="e.g. 20"
              className={styles.input}
            />
          </Field>
        </div>
      )}

      {extended && (
        <Field data-invalid={!!fieldErrors.course}>
          <FieldLabel htmlFor={`${idPrefix}-course`} className={styles.label}>
            {bookingType === "corporate"
              ? "Training Requirement *"
              : "Course of Interest *"}
          </FieldLabel>
          <Select
            value={formData.course || null}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, course: (value as string) ?? "" }))
            }
          >
            <SelectTrigger id={`${idPrefix}-course`} className={styles.select}>
              <SelectValue
                placeholder={
                  bookingType === "corporate"
                    ? "Select a requirement"
                    : "Select a course"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {(bookingType === "corporate"
                ? courseOptions.corporate
                : courseOptions.individual
              ).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError className="text-xs">{fieldErrors.course}</FieldError>
        </Field>
      )}

      {extended && bookingType === "corporate" && (
        <Field>
          <FieldLabel
            htmlFor={`${idPrefix}-preferredDate`}
            className={styles.label}
          >
            Preferred Training Date
          </FieldLabel>
          <Input
            type="date"
            id={`${idPrefix}-preferredDate`}
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className={styles.input}
          />
        </Field>
      )}

      {extended && (
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-message`} className={styles.label}>
            {bookingType === "corporate"
              ? "Additional Requirements"
              : "Anything you'd like us to know?"}
          </FieldLabel>
          <Textarea
            id={`${idPrefix}-message`}
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder={
              bookingType === "corporate"
                ? "Training goals, preferred format, venue, etc."
                : "Your goals, preferred time slot, etc."
            }
            className={styles.textarea}
          />
        </Field>
      )}

      {submitStatus === "error" && (
        <Alert variant="destructive" className={styles.alert}>
          <AlertDescription className={styles.alertText}>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto w-full gap-2 rounded-xl bg-linear-to-r from-[#c0a84f] to-[#d4bc72] py-3 font-bold text-[#0e2b49] shadow-md hover:from-[#d4bc72] hover:to-[#c0a84f] hover:shadow-[0_4px_20px_rgba(192,168,79,0.4)]"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {isSubmitting && <Spinner className="text-[#0e2b49]" />}
        {isSubmitting
          ? "Booking..."
          : bookingType === "corporate"
            ? "Request Corporate Training"
            : "Book My Free Demo Session"}
      </Button>
      <p className={styles.helperText}>
        {bookingType === "corporate"
          ? "Our team will reach out within 24 hours to discuss your requirements"
          : "No payment required • We'll confirm your slot within 24 hours"}
      </p>
    </form>
  );
}
