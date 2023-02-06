module.exports = async ({ config }) => {
  const newConfig = {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules.map((rule) => {
          if (!rule.use || !rule.use.some((loader) => loader.loader === "babel-loader")) return rule

          return {
            ...rule,
            test: /\.(mjs|jsx?|tsx?)$/,
            use: [
              ...rule.use.map((loader) => {
                if (loader.loader !== "babel-loader") return loader

                return {
                  ...loader,
                  options: {
                    ...loader.options,
                    presets: [...loader.options.presets, "@babel/preset-typescript"],
                  },
                }
              }),
            ],
          }
        }),
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [".ts", ".tsx", ...config.resolve.extensions],
    },
  }

  return newConfig
}
