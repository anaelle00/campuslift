import { startVitest } from "vitest/node";
import vitestConfig from "../vitest.config.mjs";

const command = process.argv[2] ?? "run";
const cliFilters = process.argv.slice(3);
const isWatchMode = command === "watch";

const ctx = await startVitest(
  "test",
  cliFilters,
  {
    config: false,
    run: !isWatchMode,
    watch: isWatchMode,
  },
  vitestConfig,
);

if (!isWatchMode) {
  const failedTestCount = ctx?.state.getCountOfFailedTests() ?? 0;
  await ctx?.close();
  process.exitCode = failedTestCount > 0 ? 1 : 0;
}
