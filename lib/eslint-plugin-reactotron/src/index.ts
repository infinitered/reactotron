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
const eslintPluginReactotron = {
  rules: {
    "no-tron-in-production": noTronInProduction,
  },
} satisfies Linter.Plugin

export default eslintPluginReactotron
