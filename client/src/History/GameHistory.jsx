import { Card, List, Typography } from "antd";

const { Text } = Typography;

export default function GameHistory({ history }) {
  return (
    <Card
      title="History"
      style={{
        width: "100%",             // ✅ responsive width
        maxWidth: "420px",         // ✅ cap width on desktop
        backgroundColor: "#1f1f1f",
        color: "white",
        border: "1px solid #303030",
        marginBottom: "1rem",
      }}
      bodyStyle={{ padding: "1rem" }}
    >
      <List
        size="small"
        dataSource={history}
        renderItem={(item, idx) => (
          <List.Item
            style={{
              color: "white",
              display: "flex",
              flexWrap: "wrap",     // ✅ wrap on small screens
              gap: "0.5rem",
            }}
          >
            <Text style={{ color: "white" }}>
              ✅ {item.score}/{item.total}
            </Text>
            <Text style={{ color: "white" }}>⏱ {item.time}s</Text>
            <Text style={{ color: "white" }}>🕓 {item.timestamp}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
}
