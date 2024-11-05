import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  test: {
    maxWorkers: 4,
    minWorkers: 1,
    globalSetup: ["./test/globalSetup.ts"],
    setupFiles: ["./test/setup.ts"],
    testTimeout: 1_000_000,
    hookTimeout: 1_000_000,
  },
});
