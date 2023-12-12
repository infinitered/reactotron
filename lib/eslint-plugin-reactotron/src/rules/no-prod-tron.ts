module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce using `if (__DEV__)` around `console.log.x` method calls.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "MemberExpression" &&
          callee.object.object.type === "Identifier" &&
          callee.object.object.name === "console" &&
          callee.object.property.type === "Identifier" &&
          callee.object.property.name === "tron"
        ) {
          // Check if the console.log.tron call is not wrapped in `if (__DEV__) { }`
          const sourceCode = context.getSourceCode();
          const parent = sourceCode.getAncestors(node).pop().parent.parent;

          if (
            !parent ||
            parent.type !== "IfStatement" ||
            !parent.test ||
            parent.test.type !== "Identifier" ||
            parent.test.name !== "__DEV__"
          ) {
            context.report({
              node: callee,
              message: "Use if (__DEV__) { } around console.log.x method calls.",
            });
          }
        }
      },
    };
  },
};
