import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const useHttps = fs.existsSync("../certs/key.pem");

export default defineConfig({
  plugins: [react()],
  server: {
    https: useHttps
      ? {
          key: fs.readFileSync("../certs/key.pem"),
          cert: fs.readFileSync("../certs/cert.pem"),
        }
      : false, // fallback to HTTP in case certs missing
    proxy: {
      "/api": {
        target: "https://localhost:5000",
        changeOrigin: true,
        secure: false, // allow self-signed cert
      },
    },
  },
});
