#!/usr/bin/env zx
// @ts-check
import "zx/globals";
import { getWorkspaceList } from "./tools/workspace.mjs";
$.verbose = false;

console.log(
  [
    "Validating each workspace has the correct package.json fields for publishing.",
  ].join("\n")
);

// #region Find lib workspaces
const ROOT_DIR = path.join(__dirname, "..");

const workspaceList = await getWorkspaceList();

const workspacePaths = workspaceList
  // create absolute paths
  .map((workspace) => path.join(ROOT_DIR, workspace.location))
  // filter out workspaces without /lib/ in the path
  .filter((workspacePath) => workspacePath.includes("/lib/"));

console.log(`Found ${workspacePaths.length} library workspaces`);
// #endregion

for (const workspacePath of workspacePaths) {
  console.log(`Validating "${workspacePath}"`);

  // #region Parse package.json
  const packageJsonPath = path.join(workspacePath, "package.json");
  const packageJsonFile = fs.readFileSync(packageJsonPath, "utf-8");
  if (!packageJsonFile || typeof packageJsonFile !== "string") {
    console.error(`Failed to read ${packageJsonPath}`);
    process.exit(1);
  }
  const packageJson = JSON.parse(packageJsonFile);
  if (
    !packageJson ||
    typeof packageJson !== "object" ||
    Array.isArray(packageJson)
  ) {
    console.error(`Failed to parse ${packageJsonPath}`);
    process.exit(1);
  }
  // #endregion

  // #region Validate package.json

  // assert "author" field is Infinite Red
  if (packageJson.author !== "Infinite Red") {
    console.error(
      `Invalid ${packageJsonPath} author field: ${packageJson.author}`
    );
    process.exit(1);
  }

  // assert "license" field is MIT
  if (packageJson.license !== "MIT") {
    console.error(
      `Invalid ${packageJsonPath} license field: ${packageJson.license}`
    );
    process.exit(1);
  }

  // assert "bugs.url" field is "https://github.com/infinitered/reactotron/issues"
  if (
    packageJson.bugs.url !== "https://github.com/infinitered/reactotron/issues"
  ) {
    console.error(
      `Invalid ${packageJsonPath} bugs.url field: ${packageJson.bugs.url}`
    );
    process.exit(1);
  }

  // assert "homepage" field is `https://github.com/infinitered/reactotron/tree/beta/lib/${workspaceName}`
  const workspaceName = path.basename(workspacePath);
  const expectedHomepage = `https://github.com/infinitered/reactotron/tree/beta/lib/${workspaceName}`;

  if (packageJson.homepage !== expectedHomepage) {
    console.error(
      `Invalid ${packageJsonPath} homepage field: ${packageJson.homepage}`
    );
    process.exit(1);
  }

  // assert "repository" field is `https://github.com/infinitered/reactotron/tree/beta/lib/${workspaceName}`
  if (
    packageJson.repository !==
    `https://github.com/infinitered/reactotron/tree/beta/lib/${workspaceName}`
  ) {
    console.error(
      `Invalid ${packageJsonPath} repository field: ${packageJson.repository}`
    );
    process.exit(1);
  }

  // assert "files" field should be ["dist", "src"]
  // LICENSE, README, and package.json are implicitly included https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files
  if (
    !Array.isArray(packageJson.files) ||
    packageJson.files.length !== 2 ||
    packageJson.files[0] !== "dist" ||
    packageJson.files[1] !== "src"
  ) {
    console.error(
      `Invalid ${packageJsonPath} files field: ${packageJson.files}`
    );
    process.exit(1);
  }

  // assert "main" field is "dist/index.js"
  if (packageJson.main !== "dist/index.js") {
    console.error(`Invalid ${packageJsonPath} main field: ${packageJson.main}`);
    process.exit(1);
  }

  // assert "main" field points to a real file
  const mainPath = path.join(workspacePath, packageJson.main);
  if (!fs.existsSync(mainPath)) {
    console.error(`Missing ${mainPath}`);
    process.exit(1);
  }

  // assert "module" field is "dist/index.esm.js"
  if (packageJson.module !== "dist/index.esm.js") {
    console.error(
      `Invalid ${packageJsonPath} module field: ${packageJson.module}`
    );
    process.exit(1);
  }

  // assert "module" field points to a real file
  const modulePath = path.join(workspacePath, packageJson.module);
  if (!fs.existsSync(modulePath)) {
    console.error(`Missing ${modulePath}`);
    process.exit(1);
  }

  // assert "types" field is "dist/types/src/index.d.ts"
  if (packageJson.types !== "dist/types/src/index.d.ts") {
    console.error(
      `Invalid ${packageJsonPath} types field: ${packageJson.types}`
    );
    process.exit(1);
  }

  // assert "types" field points to a real file
  const typesPath = path.join(workspacePath, packageJson.types);
  if (!fs.existsSync(typesPath)) {
    console.error(`Missing ${typesPath}`);
    process.exit(1);
  }

  // assert "react-native" field is "src/index.ts"
  if (packageJson["react-native"] !== "src/index.ts") {
    console.error(
      `Invalid ${packageJsonPath} react-native field: ${packageJson["react-native"]}`
    );
    process.exit(1);
  }

  // assert "react-native" field points to a real file
  const reactNativePath = path.join(workspacePath, packageJson["react-native"]);
  if (!fs.existsSync(reactNativePath)) {
    console.error(`Missing ${reactNativePath}`);
    process.exit(1);
  }

  // assert "exports" field is an object with "default", "import", "react-native", and "types" fields
  if (
    !packageJson.exports ||
    typeof packageJson.exports !== "object" ||
    Array.isArray(packageJson.exports) ||
    !packageJson.exports.default ||
    !packageJson.exports.import ||
    !packageJson.exports["react-native"] ||
    !packageJson.exports.types
  ) {
    console.error(
      `Invalid ${packageJsonPath} exports field: ${JSON.stringify(
        packageJson.exports,
        null,
        2
      )}`
    );
    process.exit(1);
  }

  // assert "exports.default" field is "./dist/index.js"
  if (packageJson.exports.default !== "./dist/index.js") {
    console.error(
      `Invalid ${packageJsonPath} exports.default field: ${packageJson.exports.default}`
    );
    process.exit(1);
  }

  // assert "exports.default" field points to a real file
  const exportsDefaultPath = path.join(
    workspacePath,
    packageJson.exports.default
  );
  if (!fs.existsSync(exportsDefaultPath)) {
    console.error(`Missing ${exportsDefaultPath}`);
    process.exit(1);
  }

  // assert "exports.import" field is "./dist/index.esm.js"
  if (packageJson.exports.import !== "./dist/index.esm.js") {
    console.error(
      `Invalid ${packageJsonPath} exports.import field: ${packageJson.exports.import}`
    );
    process.exit(1);
  }

  // assert "exports.import" field points to a real file
  const exportsImportPath = path.join(
    workspacePath,
    packageJson.exports.import
  );
  if (!fs.existsSync(exportsImportPath)) {
    console.error(`Missing ${exportsImportPath}`);
    process.exit(1);
  }

  // assert "exports.react-native" field is "./src/index.ts"
  if (packageJson.exports["react-native"] !== "./src/index.ts") {
    console.error(
      `Invalid ${packageJsonPath} exports.react-native field: ${packageJson.exports["react-native"]}`
    );
    process.exit(1);
  }

  // assert "exports.react-native" field points to a real file
  const exportsReactNativePath = path.join(
    workspacePath,
    packageJson.exports["react-native"]
  );
  if (!fs.existsSync(exportsReactNativePath)) {
    console.error(`Missing ${exportsReactNativePath}`);
    process.exit(1);
  }

  // assert "exports.types" field is "./dist/types/src/index.d.ts"
  if (packageJson.exports.types !== "./dist/types/src/index.d.ts") {
    console.error(
      `Invalid ${packageJsonPath} exports.types field: ${packageJson.exports.types}`
    );
    process.exit(1);
  }

  // assert "exports.types" field is a real file
  const exportsTypesPath = path.join(workspacePath, packageJson.exports.types);
  if (!fs.existsSync(exportsTypesPath)) {
    console.error(`Missing ${exportsTypesPath}`);
    process.exit(1);
  }

  // #endregion
}

console.log("All workspaces are valid!");
