import { useState } from "react";
import { Layout, Typography, Button, Card } from "antd";
import Game from "./Game/Game";
import UserLogin from "./User/UserLogin";
import { useUser } from "./User/useUser.jsx";
import GameHistory from "./History/GameHistory";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const { user, logout } = useUser();
  const [history, setHistory] = useState([]);
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      <Header
        style={{
          backgroundColor: "#1f1f1f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Title level={2} style={{ color: "#00d4ff", margin: 0 }}>
          AddVenture
        </Title>
      </Header>

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
          padding: "2rem",
          color: "white",
        }}
      >
        {!user ? (
          <UserLogin />
        ) : (
          <>
            {/* Left: Game area */}
            <div style={{ maxWidth: 500, width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <Typography.Title
                  level={4}
                  style={{ margin: 0, color: "white" }}
                >
                  Welcome, {user.name}
                </Typography.Title>

                <Button type="primary" ghost onClick={logout}>
                  Logout
                </Button>
              </div>

              <Game history={history} setHistory={setHistory} />
            </div>

            {/* Right: History panel */}
            <GameHistory history={history} />
          </>
        )}
      </Content>
    </Layout>
  );
}
