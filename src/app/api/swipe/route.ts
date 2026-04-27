import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured on this deployment" }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const swipedId = body.swipedId as string;
  const direction = body.direction as "left" | "right";

  if (!swipedId || !["left", "right"].includes(direction)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await supabase.from("swipes").insert({
    swiper_id: user.id,
    swiped_id: swipedId,
    direction
  });

  if (direction === "right") {
    const { data: reciprocalSwipe } = await supabase
      .from("swipes")
      .select("id")
      .eq("swiper_id", swipedId)
      .eq("swiped_id", user.id)
      .eq("direction", "right")
      .maybeSingle();

    if (reciprocalSwipe) {
      const ordered = [user.id, swipedId].sort();
      await supabase.from("matches").upsert(
        {
          user_a: ordered[0],
          user_b: ordered[1]
        },
        { onConflict: "user_a,user_b" }
      );

      const { data: matchedProfile } = await supabase.from("profiles").select("display_name").eq("id", swipedId).single();
      return NextResponse.json({ isMatch: true, displayName: matchedProfile?.display_name ?? "a musician" });
    }
  }

  return NextResponse.json({ isMatch: false });
}
