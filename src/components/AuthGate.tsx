"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthGate() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("Sending magic link...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Check your inbox for the sign-in link.");
  }

  return (
    <main className="page">
      <section className="card stack">
        <h1>BandMatch</h1>
        <p>Find musicians nearby and swipe right to start a band.</p>
        <form onSubmit={onSubmit} className="stack">
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderRadius: 10, border: "1px solid #4b5563", padding: 12, background: "#111827", color: "#e5e7eb" }}
          />
          <button className="btn btn-primary" type="submit">
            Email me a magic link
          </button>
        </form>
        {status ? <p>{status}</p> : null}
      </section>
    </main>
  );
}
