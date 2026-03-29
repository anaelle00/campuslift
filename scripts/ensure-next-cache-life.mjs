import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const nextTypesDir = join(process.cwd(), ".next", "types");
const cacheLifePath = join(nextTypesDir, "cache-life.d.ts");

mkdirSync(nextTypesDir, { recursive: true });

if (!existsSync(cacheLifePath)) {
  writeFileSync(
    cacheLifePath,
    "// Stub file to keep local TypeScript checks stable when Next typegen does not emit cache-life.\n",
    "utf8",
  );
}
