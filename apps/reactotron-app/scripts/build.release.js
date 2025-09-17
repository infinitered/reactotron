// @ts-check
// #region Validate inputs
const isCi = process.env.CI === "true"
let skipSigning = false
const BUILD_TARGET = process.env.BUILD_TARGET
if (BUILD_TARGET !== "macos" && BUILD_TARGET !== "linux" && BUILD_TARGET !== "windows") {
  throw new Error('BUILD_TARGET must be either "macos", "linux" or "windows"')
}
console.log(`Releasing app for target: '${BUILD_TARGET}'`)

if (isCi) {
  const path = require("path")
  const fs = require("fs")
  const CSC_LINK = path.join(
    __dirname, // ~/apps/reactotron-app/scripts
    "..", // ~/apps/reactotron-app/
    "Certificates.p12" // ~/apps/reactotron-app/Certificates.p12
  )
  if (BUILD_TARGET === "macos" && !fs.existsSync(CSC_LINK)) {
    throw new Error(`CSC_LINK not found at ${CSC_LINK} for ${BUILD_TARGET} target}`)
  }
  if (BUILD_TARGET === "macos") {
    console.log(`MacOS Code Signing Certificate found at: '${CSC_LINK}'`)
  }
} else {
  console.log("Not running in CI, skipping code signing")
  console.log(
    "For production builds: electron-builder needs a MacOS Developer Certificate in the MacOS Keychain or linked at CNC_LINK variable. See: https://www.electron.build/code-signing.html"
  )
  skipSigning = true
}
// #endregion

/** @type {Record<typeof BUILD_TARGET, string>} @see https://electron.build/cli.html */
const targetFlags = { macos: "--macos --arm64 --x64", windows: "--windows", linux: "--linux" }
let flags = `${targetFlags[BUILD_TARGET]} --publish never`

if (skipSigning) {
  flags += " -c.mac.identity=null"
}

/**
 * @type {Record<typeof BUILD_TARGET, Record<string, string>>}
 * @see https://www.electron.build/code-signing.html
 * @see https://www.electron.build/configuration/publish#githuboptions
 */
const processVars = { macos: {}, windows: {}, linux: {} }
/** @type {any} */
const env = {
  ...process.env,
  BUILD_TARGET,
  ...processVars[BUILD_TARGET],
}

/** @param cmd {string} */
const $ = (cmd) => {
  require("child_process").execSync(cmd, { env, stdio: "inherit" })
}

// Ensure Wine runtime dir on Linux CI and run under a virtual X display
const isLinux = process.platform === "linux"
if (isLinux) {
  // Provide a safe default XDG runtime dir to avoid Wine errors
  env.XDG_RUNTIME_DIR = env.XDG_RUNTIME_DIR || `/tmp/runtime-${process.getuid?.() || "1000"}`
  // Reduce Wine GUI/Mono prompts and noise in headless CI
  env.WINEDEBUG = env.WINEDEBUG || "-all"
  env.WINEDLLOVERRIDES = env.WINEDLLOVERRIDES || "mscoree,mshtml="
  env.WINEARCH = env.WINEARCH || "win64"
  env.WINEPREFIX = env.WINEPREFIX || "/tmp/wine64"
}

console.log(`Building app with flags: '${flags}'...`)
if (isCi && isLinux) {
  // Run packaging with xvfb-run to satisfy GUI requirements of Wine
  $(`yarn build && xvfb-run -a electron-builder ${flags}`)
} else {
  $(`yarn build && electron-builder ${flags}`)
}
