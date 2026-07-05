"use client";

import { useState } from "react";
import { QUEUE_POSITION } from "@/lib/data";

type Variant = "hero" | "cta";
type Status = "idle" | "submitting" | "done" | "error";

export default function WaitlistForm({ variant }: { variant: Variant }) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, source: variant }),
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
        className={`rounded-[14px] border border-cyan/40 bg-cyan/5 ${
          isCta
            ? "w-full max-w-[480px] px-6 py-5 text-left text-[14.5px] leading-[1.8]"
            : "max-w-[480px] px-5 py-[18px] text-[14.5px] leading-[1.7]"
        }`}
      >
        <div className="font-semibold">
          You&apos;re in — #{queueLabel} on the waitlist. 🎉
        </div>
        <div className="text-muted">
          Invite two friends who run stores and jump ahead 1,000 spots.
        </div>
      </div>
    );
  }

  const height = isCta ? "h-[52px]" : "h-[50px]";
  const submitting = status === "submitting";

  return (
    <div className={isCta ? "w-full max-w-[480px]" : "max-w-[480px]"}>
      <form
        onSubmit={onSubmit}
        noValidate
        className={`flex flex-wrap gap-[10px] ${
          isCta ? "justify-center" : ""
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          aria-invalid={status === "error"}
          placeholder="you@yourstore.com"
          className={`${height} flex-[1_1_220px] rounded-xl border border-line-3 bg-graphite px-[18px] text-[15px] text-frost outline-none transition-colors focus:border-cyan disabled:opacity-60`}
        />
        <button
          type="submit"
          disabled={submitting}
          className={`${height} cursor-pointer rounded-xl bg-cyan text-[15px] font-semibold text-obsidian transition-colors hover:bg-cyan-bright disabled:cursor-default disabled:opacity-70 ${
            isCta ? "px-7" : "px-6"
          }`}
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
          className={`mt-2 text-[13.5px] text-[#ff9d9d] ${
            isCta ? "text-center" : ""
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
