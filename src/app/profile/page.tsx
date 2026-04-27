import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function updateProfile(formData: FormData) {
  "use server";
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const instrumentsRaw = String(formData.get("instruments") ?? "");
  const genresRaw = String(formData.get("genres") ?? "");

  const instruments = instrumentsRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const genres = genresRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  await supabase
    .from("profiles")
    .update({
      display_name: displayName || "Musician",
      bio,
      city,
      instruments,
      genres
    })
    .eq("id", user.id);

  redirect("/");
}

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <main className="page stack">
      <header className="card stack">
        <h1>Edit Profile</h1>
        <p>Set your sound and style so you match with the right bandmates.</p>
      </header>
      <form action={updateProfile} className="card stack">
        <label className="stack">
          Display Name
          <input name="display_name" defaultValue={profile?.display_name ?? ""} className="input" required />
        </label>
        <label className="stack">
          Bio
          <textarea name="bio" defaultValue={profile?.bio ?? ""} className="input" rows={4} />
        </label>
        <label className="stack">
          City
          <input name="city" defaultValue={profile?.city ?? ""} className="input" />
        </label>
        <label className="stack">
          Instruments (comma-separated)
          <input name="instruments" defaultValue={(profile?.instruments ?? []).join(", ")} className="input" />
        </label>
        <label className="stack">
          Genres (comma-separated)
          <input name="genres" defaultValue={(profile?.genres ?? []).join(", ")} className="input" />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
          <Link href="/" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center" }}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
