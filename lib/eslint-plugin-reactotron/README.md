# eslint-plugin-reactotron

ESLint plugin containing rules to help with Reactotron code within your project

# Installing

```bash
npm i --save-dev eslint-plugin-reactotron
# or
yarn add -D eslint-plugin-reactotron
```

## Usage

Modify your plugins and rules inside `./eslintrc` or `eslintConfig` inside `package.json`

```json
"eslintConfig": {
  "plugins": [
    "reactotron"
  ],
  rules: {
    "reactotron/no-tron-in-production": "error"
  }
}
```

## Rules

### no-tron-in-production

Enforces `if (__DEV__)` around `console.tron` calls so they are not included in production.
