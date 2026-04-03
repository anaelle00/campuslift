import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const vitestConfig = {
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    pool: "threads",
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
  },
};

export default vitestConfig;
