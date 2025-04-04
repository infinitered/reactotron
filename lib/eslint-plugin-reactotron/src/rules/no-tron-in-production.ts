import { ESLintUtils } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(() => `reactotron/no-tron-in-production`)

/**
 * Enforces `if (__DEV__)` around `console.tron` calls so they are not included in production.
 */
export const noTronInProduction = createRule({
  name: "no-tron-in-production",
  meta: {
    type: "problem",
    messages: {
      noTronInProduction: "Use if (__DEV__) { } around `console.tron.{{ fnName }}` method calls.",
    },
    docs: {
      description: "Enforce using `if (__DEV__)` around `console.tron` calls.",
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
          const ancestors = sourceCode?.getAncestors
            ? sourceCode.getAncestors(node)
            : context.getAncestors()

          const parent = ancestors?.pop().parent.parent

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
              data: {
                // @ts-expect-error need to cast as AST_NODE_TYPES.MemberExpression
                fnName: callee.property.name,
              },
            })
          }
        }
      },
    }
  },
})
