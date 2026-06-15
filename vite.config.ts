/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/new-tab/",
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
  },
});
