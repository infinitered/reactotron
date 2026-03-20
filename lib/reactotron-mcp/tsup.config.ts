import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  // Bundle the MCP SDK into the output (its CJS exports are broken)
  // Keep reactotron packages external — they're workspace peers
  noExternal: ["@modelcontextprotocol/sdk"],
  external: ["reactotron-core-server", "reactotron-core-contract"],
})
