import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
      "@pike-liq-bot/utils": path.resolve(
        __dirname,
        "../../../packages/utils/src"
      ),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
