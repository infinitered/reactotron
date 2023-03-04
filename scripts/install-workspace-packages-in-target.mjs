#!/usr/bin/env zx
// @ts-check
import "zx/globals";
import { ROOT_DIR } from "./tools/path.mjs";
import { getWorkspaceList } from "./tools/workspace.mjs";

/**
 * This script copies production versions of this repositories workspace packages to a target node_modules directory.
 * This is useful for testing changes to the reactotron-* packages in other apps, such as Ignite.
 *
 * Usage: npx zx scripts/install-workspace-packages-in-target.mjs <target directory>
 * Example: npx zx scripts/install-workspace-packages-in-target.mjs ~/Code/ignite/boilerplate/node_modules
 *
 * This exists because yarn 3 and yarn 1 linking interop is stupid and this was easier :(
 */

// #region validate target path
// parse the target directory from the first argument passed to the script
const [_nodePath, _zxPath, _fileName, targetDir] = process.argv;

console.log(`Target directory: ${targetDir}`);

// if no target directory is passed, exit the script
if (!targetDir) {
  console.error("Please specify the target directory");
  process.exit(1);
}

// validate that the target directory exists
if (!fs.existsSync(targetDir)) {
  console.error(`Target directory "${targetDir}" does not exist`);
  process.exit(1);
}

// validate that the target directory is a directory
if (!fs.statSync(targetDir).isDirectory()) {
  console.error(`Target directory "${targetDir}" is not a directory`);
  process.exit(1);
}

// get the path to node_modules in the target directory
const nodeModulesPath = path.join(targetDir, "node_modules");

// if the node_modules directory does not exist, exit the script
if (!fs.existsSync(nodeModulesPath)) {
  console.error(
    `Target directory "${targetDir}" does not have a node_modules directory`
  );
  process.exit(1);
}

// validate that the node_modules directory is a directory
if (!fs.statSync(nodeModulesPath).isDirectory()) {
  console.error(
    `Target directory "${targetDir}" node_modules directory is not a directory`
  );
  process.exit(1);
}

console.log(`Merging local dependencies into "${nodeModulesPath}"`);
// #endregion

// #region find packages in target node_modules that match existing workspace packages
const workspaces = await getWorkspaceList();
const workspaceNames = workspaces.map((w) => w.name);
const packages = fs
  .readdirSync(nodeModulesPath)
  .filter((file) => workspaceNames.includes(file))
  .filter((file) =>
    fs.statSync(path.join(nodeModulesPath, file)).isDirectory()
  );

console.log(
  `Found ${packages.length} packages to merge: ${packages.join(", ")}`
);
// #endregion

// #region copy local packages into target node_modules
for (const pkg of packages) {
  console.log(`Removing ${pkg}...`);
  await $`rm -rf ${nodeModulesPath}/${pkg}`;
}

console.log("Removing existing tarballs...");
await $`rm -rf ${nodeModulesPath}/*.tgz`;

// for each package, run 'yarn pack --out nodeModulesPath/<package>.tgz' in the local workspace
for (const pkg of packages) {
  console.log(`Packing ${pkg}...`);
  const workspacePath = path.join(ROOT_DIR, "lib", pkg);
  console.log("cd to workspace: ", workspacePath);
  await $`cd ${workspacePath} && yarn pack --out ${nodeModulesPath}/${pkg}.tgz`;
}

// for each package, unzip tarball into nodeModulesPath/<package>
for (const pkg of packages) {
  console.log(`Unpacking ${pkg}...`);
  await $`tar -xzf ${nodeModulesPath}/${pkg}.tgz -C ${nodeModulesPath}`;
  console.log(`Rename ${nodeModulesPath}/package to ${nodeModulesPath}/${pkg}`); // not sure why but yarn pack always creates a package directory
  await fs.rename(`${nodeModulesPath}/package`, `${nodeModulesPath}/${pkg}`);
  console.log(`Remove ${nodeModulesPath}/${pkg}.tgz`);
  await $`rm ${nodeModulesPath}/${pkg}.tgz`;
  console.log(`Remove ${nodeModulesPath}/package temp directory`);
  await $`rm -rf ${nodeModulesPath}/package`;
}
// #endregion
