import { useState } from "react";
import { Layout, Typography, Button } from "antd";
import Game from "./Game/Game";
import UserLogin from "./User/UserLogin";
import { useUser } from "./User/useUser.jsx";
import GameHistory from "./History/GameHistory";
import Leaderboard from "./Game/Leaderboard";
import Logo from "./assets/Logo.png";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const { user, logout } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);
  const bumpRefresh = () => setRefreshKey((k) => k + 1);
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
      {/* HEADER */}
      <Content
        style={{
          minHeight: "100vh",
          backgroundColor: "#1f1f1f",
          padding: "3rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!user ? (
          <>
            {/* Top: Logo + Tagline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1rem",
              }}
            >
              <img
                src={Logo}
                alt="AddVenture Logo"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                }}
              />

              <Typography.Title
                level={2}
                style={{
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: 500,
                  marginTop: "1.5rem",
                }}
              >
                Get your name on the leaderboard today!
              </Typography.Title>

              <div style={{ color: "#bbb", fontSize: "15px", lineHeight: 2 }}>
                <div>🧠 Fast-paced mental math</div>
                <div>⏱ 60 seconds. 5 questions.</div>
                <div>🏆 Global leaderboard.</div>
              </div>
            </div>

            {/* Middle: Login box */}
            <div style={{ marginTop: "2rem" }}>
              <UserLogin />
            </div>

            {/* Bottom Spacer to push login up on big screens */}
            <div style={{ height: "2rem" }} />
          </>
        ) : (
          // Game view (same as before)
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2rem",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            {/* LEFT: Game Area */}
            <div
              style={{
                flex: "1 1 400px",
                minWidth: "300px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Title level={4} style={{ margin: 0, color: "white" }}>
                    Welcome, {user.name}
                  </Title>
                </div>
                <Button type="primary" ghost onClick={logout}>
                  Logout
                </Button>
              </div>

              <Game onGameEnd={bumpRefresh} />
            </div>

            {/* RIGHT: Sidebar */}
            <div
              style={{
                flex: "1 1 300px",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <Leaderboard refreshKey={refreshKey} />
              <GameHistory refreshKey={refreshKey} />
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
}
