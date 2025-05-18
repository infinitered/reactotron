import { rspack } from "@rspack/core"
import { defineConfig } from "@rspack/cli"
import type { SwcLoaderOptions } from "@rspack/core"
import path from "node:path"
import { type ChildProcess, spawn } from "node:child_process"
// import ReactRefreshRspackPlugin from '@rspack/plugin-react-refresh';
let mainProcess: ChildProcess | null = null
let isFirstBuild = true

export default defineConfig((env) => {
  const isDevelopment = env.RSPACK_SERVE
  return {
    mode: env.NODE_ENV === "development" ? "development" : "production",
    devtool: "source-map",
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: path.join(__dirname, "./public/index.html"),
        minify: false,
      }),
      new rspack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new rspack.ProvidePlugin({
        React: "react",
      }),
      // TODO
      // env.RSPACK_SERVE && new ReactRefreshRspackPlugin({
      //   overlay: false,
      //   forceEnable: true,
      //   exclude: /.css.ts/,
      // }),
      {
        apply(compiler) {
          if (!isDevelopment) return

          compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
            if (isFirstBuild) {
              if (mainProcess) {
                mainProcess.kill()
              }

              mainProcess = spawn("rspack", ["build", "-c", "./rspack.config.main.ts"], {
                stdio: "inherit",
                shell: true,
                env: {
                  ...process.env,
                  NODE_ENV: "development",
                },
              })

              isFirstBuild = false
            }
          })
        },
      },
    ].filter(Boolean),
    target: ["web", "electron-renderer"],
    experiments: {
      css: true,
    },
    entry: {
      renderer: path.join(__dirname, "./src/renderer/index.tsx"),
    },
    output: {
      filename: "[name].bundle.js",
      path: path.join(__dirname, "./dist/renderer"),
    },
    devServer: {
      static: path.join(__dirname, "./dist/renderer"),
      port: 3333,
      hot: false,
      liveReload: true,
    },
    externals: [
      "electron",
      "fs",
      "path",
      "crypto",
      "stream",
      "buffer",
      "util",
      "assert",
      "url",
      "os",
      "http",
      "https",
      "zlib",
      "constants",
      "timers",
      "process",
      "mitt",
      "ws",
    ],
    resolve: {
      alias: {
        "reactotron-core-server": require.resolve("reactotron-core-server"),
      },
      modules: [
        "node_modules",
        path.resolve(__dirname, "../../node_modules"), // 루트 node_modules
        path.resolve(__dirname, "./node_modules"), // 앱 node_modules
      ],
      tsConfig: path.resolve(__dirname, "./tsconfig.json"),
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  throwIfNamespace: false,
                  development: false,
                  refresh: false,
                  useBuiltins: false,
                  runtime: "automatic",
                },
              },
            },
          } as SwcLoaderOptions,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.jfif$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
        {
          test: /\.mp3$/,
          use: "file-loader",
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack", "url-loader"],
        },
        {
          test: /\.css$/i,
          type: "css",
        },
      ],
    },
  }
})
