"use client";

import { FormEvent, useState } from "react";

const TRADES = [
  "General contractor",
  "Flooring installer",
  "Renovator",
  "Electrician",
  "Plumber",
  "HVAC",
  "Builder / developer",
  "Other trade",
];

export function ProSignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      trade: String(fd.get("trade") ?? ""),
    };
    try {
      const res = await fetch("/api/pro-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("done");
      setMessage(
        "Thanks — your Supplyr Pro interest is in. Look for the Pro badge in the header; catalog prices show a 10% Pro indicator."
      );
      window.dispatchEvent(new Event("supplyr-pro"));
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-success/30 bg-success-soft p-6 text-success">
        <p className="font-display text-xl font-bold">You&apos;re on the list</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{message}</p>
        <button
          type="button"
          className="btn-navy mt-5"
          onClick={() => setStatus("idle")}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-1">
        <span className="font-semibold text-ink">Full name</span>
        <input name="name" required className="input-field mt-1.5" autoComplete="name" />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">Company</span>
        <input
          name="company"
          required
          className="input-field mt-1.5"
          autoComplete="organization"
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">Work email</span>
        <input
          name="email"
          type="email"
          required
          className="input-field mt-1.5"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-ink">Phone</span>
        <input
          name="phone"
          type="tel"
          className="input-field mt-1.5"
          autoComplete="tel"
        />
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="font-semibold text-ink">Trade</span>
        <select name="trade" className="input-field mt-1.5" defaultValue="">
          <option value="" disabled>
            Select your trade
          </option>
          {TRADES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      {status === "error" ? (
        <p className="sm:col-span-2 text-sm text-danger">{message}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Submitting…" : "Apply for Supplyr Pro"}
        </button>
        <p className="mt-3 text-xs text-ink-faint">
          No spam. We store your interest locally for follow-up — no email is
          sent from this demo form.
        </p>
      </div>
    </form>
  );
}
