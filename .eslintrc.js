/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "standard",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.base.json",
      "./apps/*/tsconfig.json",
      "./libs/*/tsconfig.json",
    ],
  },
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "no-unused-vars": 0,
    "no-undef": 0,
    "space-before-function-paren": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "import/no-cycle": "error",
  },
  ignorePatterns: [
    "**/dist/**/*",
    "**/node_modules/**/*",
    "**/build/**/*",
    "examples",
  ],
};
