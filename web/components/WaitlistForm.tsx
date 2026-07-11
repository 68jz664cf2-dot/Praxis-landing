"use client";

import { useState } from "react";
import { QUEUE_POSITION } from "@/lib/data";
import { COUNTRIES } from "@/lib/countries";

type Variant = "hero" | "cta";
type Status = "idle" | "submitting" | "done" | "error";

// No width here — callers set it, so the country/age row can size independently.
const fieldCls =
  "h-[50px] rounded-xl border border-line-3 bg-graphite px-[16px] text-[15px] text-frost outline-none transition-colors focus:border-cyan disabled:opacity-60";

export default function WaitlistForm({ variant }: { variant: Variant }) {
  const [status, setStatus] = useState<Status>("idle");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState(QUEUE_POSITION);
  const [error, setError] = useState<string | null>(null);
  const isCta = variant === "cta";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, country, age, source: variant }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPosition(data.position ?? QUEUE_POSITION);
        setStatus("done");
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    const queueLabel = position.toLocaleString("en-US");
    return (
      <div
        className={`rounded-[14px] border border-cyan/40 bg-cyan/5 px-6 py-5 text-[14.5px] leading-[1.7] ${
          isCta ? "w-full max-w-[480px] text-left" : "max-w-[480px]"
        }`}
      >
        <div className="font-semibold">
          You&apos;re in — #{queueLabel} on the waitlist. 🎉
        </div>
        <div className="text-muted">
          Invite two friends who are building something and jump ahead 1,000 spots.
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className={isCta ? "w-full max-w-[480px]" : "max-w-[480px]"}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[10px]">
        <input
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={submitting}
          placeholder="Full name"
          className={`${fieldCls} w-full`}
        />
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          placeholder="you@company.com"
          className={`${fieldCls} w-full`}
        />
        <div className="flex gap-[10px]">
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={submitting}
            className={`${fieldCls} min-w-0 flex-1 appearance-none ${
              country ? "text-frost" : "text-faint"
            }`}
          >
            <option value="" disabled>
              Country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="text-frost">
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            required
            inputMode="numeric"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={submitting}
            placeholder="Age"
            className={`${fieldCls} w-[104px] shrink-0`}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-[2px] h-[52px] w-full cursor-pointer rounded-xl bg-cyan text-[15px] font-semibold text-obsidian transition-colors hover:bg-cyan-bright disabled:cursor-default disabled:opacity-70"
        >
          {submitting
            ? "Joining…"
            : isCta
              ? "Join waitlist"
              : "Request early access"}
        </button>
      </form>
      {status === "error" && error && (
        <div
          role="alert"
          className={`mt-2 text-[13.5px] text-[#ff9d9d] ${isCta ? "text-center" : ""}`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
