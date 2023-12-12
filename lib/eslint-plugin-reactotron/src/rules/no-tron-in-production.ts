import { ESLintUtils } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(() => `reactotron/no-tron-in-production`)

export const noTronInProduction = createRule({
  name: "no-tron-in-production",
  meta: {
    type: "problem",
    messages: {
      noTronInProduction: "Use if (__DEV__) { } around console.log.x method calls.",
    },
    docs: {
      description: "Enforce using `if (__DEV__)` around `console.log.x` method calls.",
      recommended: "strict",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context
    return {
      CallExpression(node) {
        const callee = node.callee

        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "MemberExpression" &&
          callee.object.object.type === "Identifier" &&
          callee.object.object.name === "console" &&
          callee.object.property.type === "Identifier" &&
          callee.object.property.name === "tron"
        ) {
          // https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/#main
          const ancestors = sourceCode.getAncestors
            ? sourceCode.getAncestors(node)
            : context.getAncestors()

          const parent = ancestors.pop().parent.parent

          if (
            !parent ||
            parent.type !== "IfStatement" ||
            !parent.test ||
            parent.test.type !== "Identifier" ||
            parent.test.name !== "__DEV__"
          ) {
            context.report({
              node: callee,
              messageId: "noTronInProduction",
            })
          }
        }
      },
    }
  },
})
