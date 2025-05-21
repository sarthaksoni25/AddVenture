// client/src/Game/logGameStats.js
export async function logGameStats({ guestId, name, isGuest, score, total, time }) {
  try {
    const payload = {
      guestId,
      name,
      isGuest,
      score,
      total,
      time,
      timestamp: new Date().toISOString(),
    };

    await fetch(`${import.meta.env.VITE_API_URL}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Game stats logged:", payload);
  } catch (err) {
    console.error("Failed to log game stats", err);
  }
}
