import { noTronInProduction } from "../src/rules/no-tron-in-production"
import { RuleTester } from "eslint"

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2015 },
})

const RULE_NAME = "no-tron-in-production"

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  RULE_NAME, // rule name
  noTronInProduction, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: `if (__DEV__) {
          console.tron.log('test');
        }`,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: "console.tron.log('test');",
        errors: 1,
      },
    ],
  }
)

ruleTester.run(
  RULE_NAME, // rule name
  noTronInProduction, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: `if (__DEV__) { console.tron.display({ name: 'test', value: 'testing' }); }`,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: "console.tron.display({ name: 'test', value: 'testing' });",
        errors: 1,
      },
    ],
  }
)

console.log("All tests passed!")
