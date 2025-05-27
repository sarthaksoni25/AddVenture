import { useState } from "react";
import { Layout, Typography, Button } from "antd";
import Game from "./Game/Game";
import UserLogin from "./User/UserLogin";
import { useUser } from "./User/useUser.jsx";
import GameHistory from "./History/GameHistory";
import Leaderboard from "./Game/Leaderboard";
import logo from "./assets/logo.png";

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
            padding: "2rem 0", // more vertical breathing room
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "visible", // allow any slight overflow (just in case)
          }}
        >
          <img
            src={logo}
            alt="AddVenture Logo"
            style={{
              height: "190px",
              objectFit: "contain",
              marginTop: "20rem", // fixes the crop
            }}
          />
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
