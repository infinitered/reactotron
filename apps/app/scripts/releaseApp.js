// @ts-check

const BUILD_TARGET = process.env.BUILD_TARGET
if (BUILD_TARGET !== "unix" && BUILD_TARGET !== "windows") {
  throw new Error('BUILD_TARGET must be either "unix" or "windows"')
}

const path = require("path")
const fs = require("fs")
const CSC_LINK = path.join(__dirname, "../../../", "Certificates.p12")

if (BUILD_TARGET === "unix" && !fs.existsSync(CSC_LINK)) {
  throw new Error(`CSC_LINK not found at ${CSC_LINK} for ${BUILD_TARGET} target}`)
}

/** @see https://electron.build/cli.html */
const targetFlags = { unix: "-ml -c.snap.publish=github", windows: "-w" }

/** @param cmd {string} */
const $ = cmd => {
  require("child_process").execSync(cmd, {
    env: {
      ...process.env,
      BUILD_TARGET,
      // see https://www.electron.build/code-signing.html for following env vars
      CSC_LINK,
      WIN_CSC_LINK: CSC_LINK,
      CSC_IDENTITY_AUTO_DISCOVERY: "false",
    },
    stdio: "inherit",
  })
}

const flags = targetFlags[BUILD_TARGET]
$(`yarn build && electron-builder ${flags}`)
