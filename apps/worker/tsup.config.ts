import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  noExternal: [/^@lights-on\//, "zod"],
  outDir: "dist",
  sourcemap: true,
  target: "node24"
});
