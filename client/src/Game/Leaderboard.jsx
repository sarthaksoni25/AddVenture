import { useEffect, useState } from "react";
import { Card, List, Typography, Tag, Space } from "antd";
import { useUser } from "../User/useUser";

const API_URL = import.meta.env.VITE_API_URL;
const { Text } = Typography;

export default function Leaderboard(refreshKey) {
  const [data, setData] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then(setData);
  }, [refreshKey]);

  return (
    <Card
      title="🏆 Leaderboard"
      style={{
        backgroundColor: "#1f1f1f",
        color: "white",
        width: "100%", // ⬅️ full width container
        maxWidth: "420px", // ⬅️ looks great on desktop
        marginBottom: "1rem",
      }}
      bodyStyle={{ padding: "1rem" }}
    >
      <List
        dataSource={data}
        renderItem={(item, index) => {
          const isCurrent =
            user?.guestId === item.guestId || user?.name === item.name;

          return (
            <List.Item
              style={{
                display: "flex",
                flexWrap: "wrap", // ⬅️ wraps to new lines if needed
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: isCurrent ? "bold" : "normal",
                gap: "0.5rem", // adds spacing on wrap
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <Text style={{ color: "white" }}>
                  #{index + 1} • {item.name}
                </Text>
                {Boolean(item.isGuest) && (
                  <Tag color="blue" style={{ margin: 0 }}>
                    Guest
                  </Tag>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <Text style={{ color: "white" }}>
                  ✅ {item.bestScore}/{item.total}
                </Text>
                <Text style={{ color: "white" }}>⏱️ {item.time}s</Text>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
