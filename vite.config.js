import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "@tailwindcss/vite";

// https://vite.dev/config/

const env = loadEnv("", process.cwd(), "");

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    allowedHosts: ["remi-unredeemable-amani.ngrok-free.dev"],
    proxy: {
      "/api": {
        target: env.API_URL ?? "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
