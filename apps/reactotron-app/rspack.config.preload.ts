import { defineConfig } from "@rspack/cli"
import { rspack } from "@rspack/core"
import path from "node:path"

export default defineConfig((env) => {
  console.log("preload-env", env)
  const isDevelopment = process.env.NODE_ENV === "development"
  return {
    mode: isDevelopment ? "development" : "production",
    devtool: "source-map",
    target: "electron-preload",
    entry: {
      preload: path.join(__dirname, "./src/main/preload.ts"),
    },
    output: {
      path: path.join(__dirname, "./dist/main"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: "builtin:swc-loader",
          /** @type {import('@rspack/core').SwcLoaderOptions} */
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
            },
          },
        },
      ],
    },
    plugins: [
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
      }),
    ],
  }
})
