import { useEffect, useState } from "react";
import { Card, List, Typography, Tag, Space } from "antd";

const API_URL = import.meta.env.VITE_API_URL;
const { Text } = Typography;

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <Card
      title="🏆 Leaderboard"
      style={{ backgroundColor: "#1f1f1f", color: "white" }}
      bodyStyle={{ padding: "1rem" }}
    >
      <List
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Text style={{ color: "white" }}>
                #{index + 1} • {item.name}
              </Text>
              {item.isGuest && (
                <Tag color="blue" style={{ margin: 0 }}>
                  Guest
                </Tag>
              )}
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Text style={{ color: "white" }}>
                ✅ {item.bestScore}/{item.total}
              </Text>
              <Text style={{ color: "white" }}>⏱️ {item.time}s</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
