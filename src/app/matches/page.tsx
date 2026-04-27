import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="page">
        <div className="card stack">
          <p>Please sign in first.</p>
          <Link href="/">Back to home</Link>
        </div>
      </main>
    );
  }

  const { data: matches } = await supabase
    .from("matches")
    .select("id, user_a, user_b, created_at")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  const otherIds = (matches ?? []).map((match) => (match.user_a === user.id ? match.user_b : match.user_a));
  const uniqueIds = Array.from(new Set(otherIds));
  const { data: profiles } = await supabase.from("profiles").select("*").in("id", uniqueIds);

  return (
    <main className="page stack">
      <header className="card stack">
        <h1>Your Matches</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/">Back to swiping</Link>
          <Link href="/profile">Edit profile</Link>
        </div>
      </header>
      {(profiles ?? []).map((profile) => (
        <article key={profile.id} className="card stack">
          <h2>{profile.display_name}</h2>
          <p>{profile.bio}</p>
          <p>{profile.city}</p>
          <p>{profile.email}</p>
        </article>
      ))}
      {!profiles?.length ? <div className="card">No matches yet. Swipe right on more musicians.</div> : null}
    </main>
  );
}
