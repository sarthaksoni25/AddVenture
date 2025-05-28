import { useEffect, useState } from "react";
import { Card, List, Typography, Skeleton, Empty } from "antd";
import { useUser } from "../User/useUser";

const { Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Shows the logged‑in player's last 5 rounds.
 * Fetches directly from /api/history/:guestId so the list survives refreshes.
 */
export default function GameHistory(refreshKey) {
  const { user } = useUser();
  const [history, setHistory] = useState(null); // null = loading

  // ───────────────────────── FETCH ON MOUNT ─────────────────────────
  useEffect(() => {
    if (!user) return; // not logged in yet

    fetch(`${API_URL}/history/${user.guestId}`)
      .then((res) => res.json())
      .then(setHistory)
      .catch((err) => {
        console.error("/history fetch failed", err);
        setHistory([]);
      });
  }, [user, refreshKey]);

  // ───────────────────────── RENDER ─────────────────────────
  return (
    <Card
      title="📜 Your recent games"
      style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#1f1f1f",
        color: "white",
        border: "1px solid #303030",
      }}
      bodyStyle={{ padding: "1rem" }}
    >
      {/* Loading state */}
      {history === null && <Skeleton active paragraph={{ rows: 4 }} />}

      {/* Empty state */}
      {history?.length === 0 && (
        <Empty description="No games yet" style={{ color: "white" }} />
      )}

      {/* List */}
      {history && history.length > 0 && (
        <List
          size="small"
          dataSource={history}
          renderItem={(item, idx) => (
            <List.Item
              style={{
                color: "white",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <Text style={{ color: "white" }}>#{idx + 1}</Text>
              <Text style={{ color: "white" }}>
                ✅ {item.score}/{item.total}
              </Text>
              <Text style={{ color: "white" }}>⏱ {item.time}s</Text>
              <Text style={{ color: "white" }}>
                🕓 {new Date(item.timestamp).toLocaleString()}
              </Text>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
