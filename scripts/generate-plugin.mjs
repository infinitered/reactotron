#!/usr/bin/env zx
// @ts-check
import "zx/globals"

const libDir = path.join(__dirname, "../lib")
const templateDir = path.join(__dirname, "./template")

const [_nodePath, _zxPath, _fileName, _pluginName] = process.argv

const pluginName = _pluginName.includes("reactotron") ? _pluginName : `reactotron-${_pluginName}`
const targetDir = path.join(libDir, pluginName)

console.log(`Plugin name: ${pluginName}`)
// validate that the target directory exists
if (fs.existsSync(targetDir)) {
  console.error(`Plugin already exists "${targetDir}" does not exist`)
  process.exit(1)
}

fs.mkdirSync(targetDir, { recursive: true })

// static files that need to string replacements
const filesToCopy = [
  "tsconfig.json",
  "LICENSE",
  ".babelrc",
  ".prettierignore",
  ".prettierrc",
  ".gitignore",
]

for (const file of filesToCopy) {
  fs.copyFileSync(path.join(templateDir, file), path.join(targetDir, file))
}

// dynamic files where we need to update the plugin name
// or camel case version of it, etc
fs.writeFileSync(
  path.join(targetDir, "package.json"),
  JSON.stringify(getPackageJson({ pluginName }), null, 2)
)

fs.writeFileSync(path.join(targetDir, "project.json"), createProjectJson({ pluginName }))

fs.writeFileSync(path.join(targetDir, `README.md`), createTemplateREADME({ pluginName }))

fs.writeFileSync(
  path.join(targetDir, `rollup.config.ts`),
  createTemplateRollupConfig({ pluginName })
)

const srcFolder = path.join(targetDir, "src")
fs.mkdirSync(srcFolder, { recursive: true })

fs.writeFileSync(path.join(srcFolder, `index.ts`), createTemplateIndex({ pluginName }))

fs.writeFileSync(path.join(srcFolder, `${pluginName}.ts`), createTemplatePlugin({ pluginName }))

console.log(`Voila! Start building: cd ${targetDir} && yarn`)
console.log(
  "FYI you may have to update .circleci/config.yml to include your new plugin when ready."
)

/**
 * Converts a string to camel case.
 * @param {string} str - The string to be converted.
 * @returns {string} - The camel case version of the string.
 */
function camelize(str) {
  const arr = str.split("-")
  const capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
  )
  return capital.join("")
}

/**
 * Converts a string to proper case.
 * @param {string} str - The string to be converted.
 * @returns {string} - The proper case version of the string.
 */
function properCase(str) {
  const arr = str.split("-")
  const capital = arr.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
  return capital.join("")
}

/**
 * Creates a template index for a plugin.
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string}
 */
function createTemplateIndex({ pluginName }) {
  let template = fs.readFileSync(path.join(templateDir, "src", "index.ts"), "utf8")

  template = template.replace(
    /templatePlugin/g,
    `${camelize(pluginName.replace("reactotron-", ""))}Plugin`
  )
  template = template.replace(/reactotron-template/g, pluginName)

  return template
}

/**
 * Creates a project.json index for a plugin.
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string}
 */
function createProjectJson({ pluginName }) {
  let template = fs.readFileSync(path.join(templateDir, "project.json"), "utf8")

  template = template.replace(/reactotron-template/g, pluginName)

  return template
}

/**
 * Creates a template plugin
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string}
 */
function createTemplatePlugin({ pluginName }) {
  let template = fs.readFileSync(path.join(templateDir, `src/reactotron-template.ts`), "utf8")

  template = template.replace(/Template/g, `${properCase(pluginName.replace("reactotron-", ""))}`)

  template = template.replace(
    /templatePlugin/g,
    `${camelize(pluginName.replace("reactotron-", ""))}Plugin`
  )

  return template
}

/**
 * Creates a template index for a readme.
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string}
 */
function createTemplateREADME({ pluginName }) {
  let template = fs.readFileSync(path.join(templateDir, "README.md"), "utf8")

  template = template.replace(/reactotron-template/g, pluginName)

  return template
}

/**
 * Creates a rollup config for a plugin.
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string} .
 */
function createTemplateRollupConfig({ pluginName }) {
  let template = fs.readFileSync(path.join(templateDir, "rollup.config.ts"), "utf8")

  template = template.replace(/reactotron-template/g, pluginName)

  return template
}

/**
 * Get package.json for a plugin
 * @param {Object} options - The options for creating the template index.
 * @param {string} options.pluginName - The name of the plugin.
 * @returns {string}
 */
function getPackageJson({ pluginName }) {
  const templatePackageJson = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf8")
  )

  templatePackageJson.name = pluginName
  ;(templatePackageJson.homepage = `https://github.com/infinitered/reactotron/tree/master/lib/${pluginName}`),
    (templatePackageJson.repository = `https://github.com/infinitered/reactotron/tree/master/lib/${pluginName}`)

  return templatePackageJson
}
