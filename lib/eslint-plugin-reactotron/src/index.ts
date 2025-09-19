import type { Linter } from "@typescript-eslint/utils/ts-eslint"
import { noTronInProduction } from "./rules/no-tron-in-production"

/**
 * Modify your plugins and rules inside `./eslintrc` or `eslintConfig` inside `package.json`
 * 
 * @example 
 * ```json
    "eslintConfig": {
      "plugins": [
        "reactotron"
      ],
      "rules": {
        "reactotron/no-tron-in-production": "error"
      }
    }
  ```
 */
export const rules: Record<string, any> = {
  "no-tron-in-production": noTronInProduction,
}

// Export the plugin object directly
const plugin: Linter.Plugin = { rules }
export default plugin
