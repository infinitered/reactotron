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
    tsconfigRootDir: __dirname, // this option prevents us from specifying this file in "eslintConfig" package.json key https://github.com/typescript-eslint/typescript-eslint/issues/251
    project: [
      "./tsconfig.base.json",
      "./apps/*/tsconfig.json",
      "./lib/*/tsconfig.json",
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
    "import/ignore": [
      "node_modules/react-native/index\\.js$",
      "react-native/Libraries/LogBox/Data/parseLogBoxLog.js",
      "react-native/Libraries/LogBox/LogBox.js",
      "react-native/Libraries/Core/NativeExceptionsManager.js",
    ],
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
    "@typescript-eslint/no-empty-function": [2, { allow: ["arrowFunctions"] }],
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
    "scripts",
  ],
};
