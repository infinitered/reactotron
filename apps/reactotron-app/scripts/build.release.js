// @ts-check
// #region Validate inputs
const BUILD_TARGET = process.env.BUILD_TARGET
if (BUILD_TARGET !== "macos" && BUILD_TARGET !== "linux" && BUILD_TARGET !== "windows") {
  throw new Error('BUILD_TARGET must be either "macos", "linux" or "windows"')
}
console.log(`Releasing app for target: '${BUILD_TARGET}'`)

const path = require("path")
const fs = require("fs")
const CSC_LINK = path.join(
  __dirname, // /apps/app/scripts
  "..", // /apps/app/
  "Certificates.p12" // /apps/app/Certificates.p12
)
if (BUILD_TARGET === "macos" && !fs.existsSync(CSC_LINK)) {
  throw new Error(`CSC_LINK not found at ${CSC_LINK} for ${BUILD_TARGET} target}`)
}
if (BUILD_TARGET === "macos") {
  console.log(`MacOS Code Signing Certificate found at: '${CSC_LINK}'`)
}
// #endregion

/** @type {Record<typeof BUILD_TARGET, string>} @see https://electron.build/cli.html */
const targetFlags = { macos: "--macos", windows: "--windows", linux: "--linux" }
const flags = `${targetFlags[BUILD_TARGET]} --publish never`

/**
 * @type {Record<typeof BUILD_TARGET, Record<string, string>>}
 * @see https://www.electron.build/code-signing.html
 * @see https://www.electron.build/configuration/publish#githuboptions
 */
const processVars = { macos: {}, windows: {}, linux: {} }
const env = {
  ...process.env,
  BUILD_TARGET,
  ...processVars[BUILD_TARGET],
}

/** @param cmd {string} */
const $ = cmd => {
  require("child_process").execSync(cmd, { env, stdio: "inherit" })
}

console.log(`Building app with flags: '${flags}'...`)
$(`yarn build && electron-builder ${flags}`)
