import { Button } from "antd";
import { useEffect } from "react";
import { useUser } from "./useUser";
const API_URL = import.meta.env.VITE_API_URL;

export default function UserLogin() {
  const { login } = useUser();

  const handleGoogleResponse = async (response) => {
    const { credential } = response;

    const res = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    if (res.ok) {
      const data = await res.json();
      login({
        name: data.name,
        email: data.email,
        picture: data.picture,
        isGuest: false,
      });
    } else {
      console.error("Login failed");
    }
  };

  useEffect(() => {
    const renderGoogleButton = () => {
      const btn = document.getElementById("google-login-btn");

      if (!window.google || !google.accounts) {
        console.warn("Google script not loaded");
        return;
      }

      if (!btn || btn.childElementCount > 0) return;

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
        width: 280,
      });
    };

    const timeout = setTimeout(renderGoogleButton, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        width: 320,
        backgroundColor: "#1f1f1f",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.4)",
        textAlign: "center",
      }}
    >
      {/* ✅ Center the Google button container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
          width: "100%",
        }}
      >
        <div id="google-login-btn" />
      </div>

      <Button type="default" block onClick={() => login("Guest")}>
        Continue as Guest
      </Button>
    </div>
  );
}
