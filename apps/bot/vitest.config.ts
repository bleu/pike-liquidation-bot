import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  test: {
    // environment: "node",
    globalSetup: ["./test/globalSetup.ts"],
    setupFiles: ["./test/setup.ts"],
    hookTimeout: 60_000,
    testTimeout: 60_000,
  },
});
