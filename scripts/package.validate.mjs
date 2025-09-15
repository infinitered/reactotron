#!/usr/bin/env zx
// @ts-check
import "zx/globals"
import { getWorkspaceList } from "./tools/workspace.mjs"
$.verbose = false

console.log(
  ["Validating each workspace has the correct package.json fields for publishing."].join("\n")
)

// #region Find lib workspaces
const ROOT_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "..")

const workspaceList = await getWorkspaceList()

const workspacePaths = workspaceList
  // create absolute paths
  .map((workspace) => path.join(ROOT_DIR, workspace.location))
  // filter out workspaces without /lib/ in the path
  .filter((workspacePath) => workspacePath.includes("/lib/"))

console.log(`Found ${workspacePaths.length} library workspaces`)
console.log("")
// #endregion

// Track results for all packages
const validationResults = []

for (const workspacePath of workspacePaths) {
  const workspaceName = path.basename(workspacePath)
  const errors = []

  console.log(`🔍 Validating "${workspaceName}"...`)

  // #region Parse package.json
  const packageJsonPath = path.join(workspacePath, "package.json")

  let packageJson
  try {
    const packageJsonFile = fs.readFileSync(packageJsonPath, "utf-8")
    if (!packageJsonFile || typeof packageJsonFile !== "string") {
      errors.push(`Failed to read ${packageJsonPath}`)
    } else {
      packageJson = JSON.parse(packageJsonFile)
      if (!packageJson || typeof packageJson !== "object" || Array.isArray(packageJson)) {
        errors.push(`Failed to parse ${packageJsonPath}`)
      }
    }
  } catch (error) {
    errors.push(`Failed to read or parse ${packageJsonPath}: ${error.message}`)
  }

  // Skip validation if we can't parse the package.json
  if (errors.length > 0 || !packageJson) {
    validationResults.push({ workspaceName, workspacePath, passed: false, errors })
    continue
  }
  // #endregion

  // #region Validate package.json

  // assert "author" field is Infinite Red
  if (packageJson.author !== "Infinite Red") {
    errors.push(`Invalid author field: "${packageJson.author}" (expected "Infinite Red")`)
  }

  // assert "license" field is MIT
  if (packageJson.license !== "MIT") {
    errors.push(`Invalid license field: "${packageJson.license}" (expected "MIT")`)
  }

  // assert "bugs.url" field is "https://github.com/infinitered/reactotron/issues"
  if (packageJson.bugs?.url !== "https://github.com/infinitered/reactotron/issues") {
    errors.push(
      `Invalid bugs.url field: "${packageJson.bugs?.url}" (expected "https://github.com/infinitered/reactotron/issues")`
    )
  }

  // assert "homepage" field is `https://github.com/infinitered/reactotron/tree/master/lib/${workspaceName}`
  const expectedHomepage = `https://github.com/infinitered/reactotron/tree/master/lib/${workspaceName}`
  if (packageJson.homepage !== expectedHomepage) {
    errors.push(
      `Invalid homepage field: "${packageJson.homepage}" (expected "${expectedHomepage}")`
    )
  }

  // assert "repository" field is `https://github.com/infinitered/reactotron/tree/master/lib/${workspaceName}`
  const expectedRepository = `https://github.com/infinitered/reactotron/tree/master/lib/${workspaceName}`
  if (packageJson.repository !== expectedRepository) {
    errors.push(
      `Invalid repository field: "${packageJson.repository}" (expected "${expectedRepository}")`
    )
  }

  // assert "files" field should be ["dist", "src"]
  // LICENSE, README, and package.json are implicitly included https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files
  if (
    !Array.isArray(packageJson.files) ||
    packageJson.files.length !== 2 ||
    packageJson.files[0] !== "dist" ||
    packageJson.files[1] !== "src"
  ) {
    errors.push(
      `Invalid files field: ${JSON.stringify(packageJson.files)} (expected ["dist", "src"])`
    )
  }

  // assert "main" field is "dist/index.js"
  if (packageJson.main !== "dist/index.js") {
    errors.push(`Invalid main field: "${packageJson.main}" (expected "dist/index.js")`)
  }

  // assert "main" field points to a real file
  const mainPath = path.join(workspacePath, packageJson.main || "")
  if (!fs.existsSync(mainPath)) {
    errors.push(`Missing main file: ${mainPath}`)
  }

  // assert "module" field is "dist/index.esm.js"
  if (packageJson.module !== "dist/index.esm.js") {
    errors.push(`Invalid module field: "${packageJson.module}" (expected "dist/index.esm.js")`)
  }

  // assert "module" field points to a real file
  const modulePath = path.join(workspacePath, packageJson.module || "")
  if (!fs.existsSync(modulePath)) {
    errors.push(`Missing module file: ${modulePath}`)
  }

  // assert "types" field is "dist/types/src/index.d.ts"
  if (packageJson.types !== "dist/types/src/index.d.ts") {
    errors.push(
      `Invalid types field: "${packageJson.types}" (expected "dist/types/src/index.d.ts")`
    )
  }

  // assert "types" field points to a real file
  const typesPath = path.join(workspacePath, packageJson.types || "")
  if (!fs.existsSync(typesPath)) {
    errors.push(`Missing types file: ${typesPath}`)
  }

  // assert "react-native" field is "src/index.ts"
  if (packageJson["react-native"] !== "src/index.ts") {
    errors.push(
      `Invalid react-native field: "${packageJson["react-native"]}" (expected "src/index.ts")`
    )
  }

  // assert "react-native" field points to a real file
  const reactNativePath = path.join(workspacePath, packageJson["react-native"] || "")
  if (!fs.existsSync(reactNativePath)) {
    errors.push(`Missing react-native file: ${reactNativePath}`)
  }

  // assert "exports" field is an object with "default", "import", and "types" fields
  if (
    !packageJson.exports ||
    typeof packageJson.exports !== "object" ||
    Array.isArray(packageJson.exports) ||
    !packageJson.exports.default ||
    !packageJson.exports.import ||
    !packageJson.exports.types
  ) {
    errors.push(
      `Invalid exports field: ${JSON.stringify(packageJson.exports, null, 2)} (must have default, import, and types fields)`
    )
  }

  // assert "exports.react-native" field does not exist
  if (packageJson.exports?.["react-native"]) {
    errors.push(
      [
        `exports.react-native field should not exist`,
        `Remove this check once typescript types are more stable`,
        `See https://github.com/infinitered/reactotron/issues/1430`,
      ].join(" - ")
    )
  }

  // assert "exports.default" field is "./dist/index.js"
  if (packageJson.exports?.default !== "./dist/index.js") {
    errors.push(
      `Invalid exports.default field: "${packageJson.exports?.default}" (expected "./dist/index.js")`
    )
  }

  // assert "exports.default" field points to a real file
  const exportsDefaultPath = path.join(workspacePath, packageJson.exports?.default || "")
  if (packageJson.exports?.default && !fs.existsSync(exportsDefaultPath)) {
    errors.push(`Missing exports.default file: ${exportsDefaultPath}`)
  }

  // assert "exports.import" field is "./dist/index.esm.js"
  if (packageJson.exports?.import !== "./dist/index.esm.js") {
    errors.push(
      `Invalid exports.import field: "${packageJson.exports?.import}" (expected "./dist/index.esm.js")`
    )
  }

  // assert "exports.import" field points to a real file
  const exportsImportPath = path.join(workspacePath, packageJson.exports?.import || "")
  if (packageJson.exports?.import && !fs.existsSync(exportsImportPath)) {
    errors.push(`Missing exports.import file: ${exportsImportPath}`)
  }

  // assert "exports.types" field is "./dist/types/src/index.d.ts"
  if (packageJson.exports?.types !== "./dist/types/src/index.d.ts") {
    errors.push(
      `Invalid exports.types field: "${packageJson.exports?.types}" (expected "./dist/types/src/index.d.ts")`
    )
  }

  // assert "exports.types" field is a real file
  const exportsTypesPath = path.join(workspacePath, packageJson.exports?.types || "")
  if (packageJson.exports?.types && !fs.existsSync(exportsTypesPath)) {
    errors.push(`Missing exports.types file: ${exportsTypesPath}`)
  }

  // #endregion

  // Record the results for this package
  const passed = errors.length === 0
  validationResults.push({ workspaceName, workspacePath, passed, errors })

  if (passed) {
    console.log(`  ✅ ${workspaceName} - PASSED`)
  } else {
    console.log(
      `  ❌ ${workspaceName} - FAILED (${errors.length} issue${errors.length === 1 ? "" : "s"})`
    )
  }
}

// #region Generate Summary Report
console.log("")
console.log("=".repeat(80))
console.log("📊 VALIDATION SUMMARY")
console.log("=".repeat(80))

const passedPackages = validationResults.filter((result) => result.passed)
const failedPackages = validationResults.filter((result) => !result.passed)

console.log(`Total packages: ${validationResults.length}`)
console.log(`✅ Passed: ${passedPackages.length}`)
console.log(`❌ Failed: ${failedPackages.length}`)
console.log("")

if (passedPackages.length > 0) {
  console.log("✅ PASSED PACKAGES:")
  passedPackages.forEach((result) => {
    console.log(`  • ${result.workspaceName}`)
  })
  console.log("")
}

if (failedPackages.length > 0) {
  console.log("❌ FAILED PACKAGES:")
  failedPackages.forEach((result) => {
    console.log(
      `  • ${result.workspaceName} (${result.errors.length} issue${result.errors.length === 1 ? "" : "s"})`
    )
    result.errors.forEach((error, index) => {
      console.log(`    ${index + 1}. ${error}`)
    })
    console.log("")
  })
}

console.log("=".repeat(80))

if (failedPackages.length === 0) {
  console.log("🎉 All packages passed validation!")
  process.exit(0)
} else {
  console.log(
    `💥 ${failedPackages.length} package${failedPackages.length === 1 ? "" : "s"} failed validation.`
  )
  process.exit(1)
}
// #endregion
