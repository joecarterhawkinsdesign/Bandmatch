"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";

type Profile = {
  id: string;
  display_name: string;
  bio: string;
  instruments: string[];
  genres: string[];
  city: string;
};

type Props = {
  profiles: Profile[];
};

export function SwipeDeck({ profiles }: Props) {
  const [items, setItems] = useState(profiles);
  const [message, setMessage] = useState("");

  async function sendSwipe(swipedId: string, direction: "left" | "right") {
    const response = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swipedId, direction })
    });

    const payload = await response.json();
    if (payload?.isMatch) {
      setMessage(`It's a match with ${payload.displayName}!`);
    } else if (direction === "right") {
      setMessage("Liked! Keep swiping.");
    } else {
      setMessage("Skipped.");
    }
  }

  function onSwipe(profile: Profile, direction: "left" | "right") {
    setItems((prev) => prev.filter((p) => p.id !== profile.id));
    void sendSwipe(profile.id, direction);
  }

  function onDragEnd(profile: Profile, info: PanInfo) {
    if (info.offset.x > 110) onSwipe(profile, "right");
    if (info.offset.x < -110) onSwipe(profile, "left");
  }

  const current = items[0];

  return (
    <section className="stack">
      <p style={{ minHeight: 24 }}>{message}</p>
      {!current ? (
        <div className="card">No more profiles right now. Check back later.</div>
      ) : (
        <motion.article
          key={current.id}
          className="card stack"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => onDragEnd(current, info)}
          whileDrag={{ scale: 1.04 }}
        >
          <h2>{current.display_name}</h2>
          <p>{current.bio || "Looking for great bandmates."}</p>
          <p>
            <strong>Instruments:</strong> {current.instruments.join(", ") || "Any"}
          </p>
          <p>
            <strong>Genres:</strong> {current.genres.join(", ") || "Open"}
          </p>
          <p>
            <strong>City:</strong> {current.city || "Unknown"}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => onSwipe(current, "left")}>
              Skip
            </button>
            <button className="btn btn-primary" onClick={() => onSwipe(current, "right")}>
              Like
            </button>
          </div>
        </motion.article>
      )}
    </section>
  );
}
