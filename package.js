"use strict"

require("babel-polyfill")
const webpack = require("webpack")
const electronCfg = require("./webpack.config.electron.js")
const cfg = require("./webpack.config.production.js")
const packager = require("electron-packager")
const del = require("del")
const exec = require("child_process").exec
const argv = require("minimist")(process.argv.slice(2))
const pkg = require("./package.json")
const deps = Object.keys(pkg.dependencies)
const devDeps = Object.keys(pkg.devDependencies)
const R = require("ramda")
const RS = require("ramdasauce")

const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false

const DEFAULT_OPTS = {
  dir: "./",
  name: appName,
  asar: shouldUseAsar,
  appBundleId: "com.reactotron.app",
  ignore: ["^/test($|/)", "^/release($|/)", "^/main.development.js"]
    .concat(devDeps.map(name => `/node_modules/${name}($|/)`))
    .concat(
      deps
        .filter(name => !electronCfg.externals.includes(name))
        .map(name => `/node_modules/${name}($|/)`)
    ),
}

const icon = argv.icon || argv.i || "App/App"

if (icon) {
  DEFAULT_OPTS.icon = icon
}

const version = argv.version || argv.v

if (version) {
  DEFAULT_OPTS.electronVersion = version
  doEverything()
} else {
  // use the same version as the currently-installed electron
  exec("npm list electron --depth 0 --dev", (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.electronVersion = "3.0.3"
    } else {
      DEFAULT_OPTS.electronVersion = R.pipe(
        R.split(/\s/),
        R.find(RS.startsWith("electron@")),
        R.split("@"),
        R.last
      )(stdout)
    }
    doEverything()
  })
}

function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function doEverything() {
  console.log("start builds...")
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del("release"))
    .then(() => pack("darwin", "x64"))
    .then(() => pack("linux", "ia32"))
    .then(() => pack("linux", "x64"))
    .then(() => pack("win32", "ia32"))
    .then(() => pack("win32", "x64"))
    .catch(err => {
      console.error(err)
    })
}

function pack(plat, arch) {
  const iconObj = {
    icon:
      DEFAULT_OPTS.icon +
      (() => {
        let extension = ".png"
        if (plat === "darwin") {
          extension = ".icns"
        } else if (plat === "win32") {
          extension = ".ico"
        }
        return extension
      })(),
  }

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    appVersion: pkg.version || DEFAULT_OPTS.version,
    out: `release/${plat}-${arch}`,
  })

  return packager(opts)
}
