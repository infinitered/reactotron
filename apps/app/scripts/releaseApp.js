// @ts-check

const BUILD_TARGET = process.env.BUILD_TARGET
if (BUILD_TARGET !== "unix" && BUILD_TARGET !== "windows") {
  throw new Error('BUILD_TARGET must be either "unix" or "windows"')
}

/** @see https://electron.build/cli.html */
const targetFlags = { unix: "-ml -c.snap.publish=github", windows: "-w" }

/** @param cmd {string} */
const $ = cmd => {
  require("child_process").execSync(cmd, {
    env: { ...process.env, BUILD_TARGET },
    stdio: "inherit",
  })
}

const flags = targetFlags[BUILD_TARGET]
$(`yarn build && electron-builder ${flags}`)
