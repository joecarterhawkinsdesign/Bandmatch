import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { SwipeDeck } from "@/components/SwipeDeck";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthGate />;
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? "",
      display_name: (user.email ?? "musician").split("@")[0],
      bio: "Tell people about your band goals.",
      instruments: ["Guitar"],
      genres: ["Rock"],
      city: "London"
    });
  }

  const { data: swipedRows } = await supabase.from("swipes").select("swiped_id").eq("swiper_id", user.id);
  const swipedIds = new Set((swipedRows ?? []).map((row) => row.swiped_id));
  swipedIds.add(user.id);

  const { data: allCandidates } = await supabase.from("profiles").select("*").neq("id", user.id);
  const candidates = (allCandidates ?? []).filter((candidate) => !swipedIds.has(candidate.id));

  return (
    <main className="page stack">
      <header className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>BandMatch</h1>
          <p style={{ marginBottom: 0 }}>Welcome back, {user.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="btn btn-secondary" type="submit">
            Sign out
          </button>
        </form>
      </header>
      <SwipeDeck profiles={candidates ?? []} />
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/matches">View my matches</Link>
        <Link href="/profile">Edit profile</Link>
      </div>
    </main>
  );
}
