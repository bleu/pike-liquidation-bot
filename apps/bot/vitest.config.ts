import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  test: {
    maxWorkers: 4,
    minWorkers: 1,
  },
});
