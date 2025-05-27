import { Button } from "antd";
import { useEffect } from "react";
import { useUser } from "./useUser";
const API_URL = import.meta.env.VITE_API_URL;

export default function UserLogin() {
  const { login } = useUser();

  useEffect(() => {
    const renderGoogleButton = () => {
      const btn = document.getElementById("google-login-btn");

      if (!window.google || !google.accounts) return;
      if (!btn || btn.childElementCount > 0) return; // already rendered

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
        width: 300,
      });
    };

    // Retry after short delay in case DOM isn't ready
    const timeout = setTimeout(renderGoogleButton, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleGoogleResponse = async (response) => {
    const { credential } = response;

    const res = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div
      style={{
        width: 300,
        backgroundColor: "#1a1a1a",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <div id="google-login-btn" style={{ marginBottom: 16 }} />

      <Button type="default" block onClick={() => login("Guest")}>
        Continue as Guest
      </Button>
    </div>
  );
}
