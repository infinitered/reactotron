module.exports = function(wallaby) {
  return {
    files: ["src/**/*.ts", "!src/**/*.test.ts"],

    tests: ["src/**/*.test.ts"],

    compilers: {
      "**/*.ts": wallaby.compilers.babel(),
    },

    env: {
      type: "node",
      runner: "node",
    },

    testFramework: "jest",
  }
}
