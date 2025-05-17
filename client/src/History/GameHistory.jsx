import { Card, List, Typography } from "antd";

const { Text } = Typography;

export default function GameHistory({ history }) {
  return (
    <Card
      title="History"
      style={{
        width: 300,
        backgroundColor: "#1f1f1f",
        color: "white",
        border: "1px solid #303030",
      }}
      bodyStyle={{ padding: "1rem" }}
    >
      <List
        size="small"
        dataSource={history}
        renderItem={(item, idx) => (
          <List.Item style={{ color: "white" }}>
            <Text style={{ color: "white" }}>
              ✅ {item.score}/{item.total} • ⏱ {item.time}s • 🕓 {item.timestamp}
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
}
