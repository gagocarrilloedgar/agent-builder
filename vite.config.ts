import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["./tests/**/*.test.{tsx,ts}"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
});
