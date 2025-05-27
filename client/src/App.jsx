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
  const [history, setHistory] = useState([]);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
      {/* HEADER */}
      {!user && (
        <Header
          style={{
            backgroundColor: "#1f1f1f",
            padding: "4rem 0 2rem", // more top/bottom space
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            overflow: "visible",
          }}
        >
          <img
            src={Logo}
            alt="AddVenture Logo"
            style={{
              height: "180px",
              objectFit: "contain",
              marginBottom: "1.5rem",
            }}
          />

          <Typography.Title
            level={2}
            style={{
              color: "#fff",
              fontWeight: 500,
              fontSize: "24px",
              marginBottom: "1.25rem",
            }}
          >
            Get your name on the leaderboard today!
          </Typography.Title>

          <div style={{ color: "#bbb", fontSize: "15px", lineHeight: 2 }}>
            <div>🧠&nbsp;Fast-paced mental math</div>
            <div>⏱&nbsp;60 seconds. 5 questions.</div>
            <div>🏆&nbsp;Global leaderboard.</div>
          </div>
        </Header>
      )}

      {/* CONTENT */}
      <Content
        style={{
          display: "flex",
          flexDirection: user ? "row" : "column",
          justifyContent: "center",
          alignItems: user ? "flex-start" : "center",
          gap: "2rem",
          padding: "2rem",
          color: "white",
          minHeight: "calc(100vh - 80px)", // subtract header height
        }}
      >
        {!user ? (
          <UserLogin />
        ) : (
          <>
            {/* GAME AREA */}
            <div
              style={{
                flex: 1,
                maxWidth: "500px",
                width: "100%",
              }}
            >
              {/* User Welcome Row */}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
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

              <Game history={history} setHistory={setHistory} />
            </div>

            {/* SIDEBAR */}
            <div
              style={{
                flex: 1,
                maxWidth: "420px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <Leaderboard />
              <GameHistory history={history} />
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
}
