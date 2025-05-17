import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import App from "./App.jsx";
import { UserProvider } from "./User/useUser.jsx";
import "antd/dist/reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#00d4ff", // accent color
        },
      }}
    >
      <UserProvider>
        <App />
      </UserProvider>
    </ConfigProvider>
  </StrictMode>
);
