import { defineConfig } from "@rspack/cli"
import { rspack } from "@rspack/core"
import path from "node:path"
import { type ChildProcess, spawn } from "node:child_process"

let electronProcess: ChildProcess | null = null

// Kill Electron process when the process exits
function cleanup() {
  if (electronProcess) {
    console.log("🧹 Cleaning up Electron process...")
    if (process.platform === "win32" && electronProcess.pid) {
      try {
        spawn("taskkill", ["/pid", electronProcess.pid.toString(), "/T", "/F"], {
          stdio: "inherit",
          shell: true,
        })
      } catch (err) {
        console.warn("Failed to kill electron process during cleanup:", err)
      }
    } else {
      electronProcess.kill("SIGTERM")
    }
    electronProcess = null
  }
}

process.on("SIGINT", cleanup)
process.on("SIGTERM", cleanup)
process.on("exit", cleanup)

const optionalPlugins: any[] = []
if (process.platform !== "darwin") {
  optionalPlugins.push(new rspack.IgnorePlugin({ resourceRegExp: /^fsevents$/ }))
  optionalPlugins.push(new rspack.IgnorePlugin({ resourceRegExp: /^dmg-builder$/ }))
}
optionalPlugins.push(new rspack.IgnorePlugin({ resourceRegExp: /^osx-temperature-sensor$/ }))

export default defineConfig((env) => {
  console.log("main-env", env)
  const isDevelopment = process.env.NODE_ENV === "development"
  return {
    mode: isDevelopment ? "development" : "production",
    devtool: "source-map",
    target: "electron-main",
    entry: {
      main: path.join(__dirname, "./src/main/index.ts"),
    },
    output: {
      path: path.join(__dirname, "./dist/main"),
      filename: "[name].js",
      library: {
        type: "commonjs2",
      },
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
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
      "reactotron-core-server",
      "node:fs",
      "node:path",
      "node:crypto",
      "node:stream",
      "node:buffer",
      "node:util",
      "node:assert",
    ],
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
    watch: isDevelopment,
    watchOptions: {
      ignored: /node_modules/,
      include: ["src/main/**/*"],
    },
    plugins: [
      ...optionalPlugins,
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
        "process.env.ELECTRON_WEBPACK_WDS_PORT": JSON.stringify(3333),
      }),
      {
        apply(compiler) {
          if (!isDevelopment) return
          compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
            // Force kill existing Electron process
            if (electronProcess) {
              console.log("🔄 Restarting Electron process...")

              // Kill entire process tree on Windows
              if (process.platform === "win32" && electronProcess.pid) {
                try {
                  spawn("taskkill", ["/pid", electronProcess.pid.toString(), "/T", "/F"], {
                    stdio: "inherit",
                    shell: true,
                  })
                } catch (err) {
                  console.warn("Failed to kill process tree:", err)
                }
              } else {
                // SIGTERM followed by SIGKILL on Unix systems
                electronProcess.kill("SIGTERM")
                setTimeout(() => {
                  if (electronProcess && !electronProcess.killed) {
                    electronProcess.kill("SIGKILL")
                  }
                }, 2000)
              }

              electronProcess = null
            }

            // Start new Electron process (with slight delay)
            setTimeout(() => {
              electronProcess = spawn("electron", [path.join(__dirname, "./dist/main/main.js")], {
                stdio: "inherit",
                shell: true,
              })

              electronProcess.on("error", (err) => {
                console.error("❌ Electron process error:", err)
              })

              electronProcess.on("exit", (code, signal) => {
                console.log(`🔄 Electron process exited with code ${code} and signal ${signal}`)
                electronProcess = null
              })
            }, 500)
          })
        },
      },
    ],
  }
})
