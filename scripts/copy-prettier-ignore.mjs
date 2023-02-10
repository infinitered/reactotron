#!/usr/bin/env zx
// @ts-check
import "zx/globals";
import { getWorkspaceList } from "./tools/workspace.mjs";
$.verbose = false;

const ROOT_DIR = path.join(__dirname, "..");
const PRETTIER_IGNORE_PATH = path.join(ROOT_DIR, ".prettierignore");

// check if the .prettierignore file exists
if (!fs.existsSync(PRETTIER_IGNORE_PATH)) {
  console.log(`No .prettierignore file found at ${PRETTIER_IGNORE_PATH}`);
  process.exit(1);
}
console.log(`found ".prettierignore" file at ${PRETTIER_IGNORE_PATH}`);

// get all the workspaces in the directory
const workspaceList = await getWorkspaceList();

// get a path to the root of each workspace
const workspacePaths = workspaceList.map((workspace) => {
  return path.join(ROOT_DIR, workspace.location);
});

console.log(
  `found ${workspacePaths.length} workspaces: ${workspacePaths.join(", ")}`
);

// copy the .prettierignore file to each workspace
for (const workspacePath of workspacePaths) {
  const workspacePrettierIgnorePath = path.join(
    workspacePath,
    ".prettierignore"
  );
  // check if the .prettierignore file already exists in the workspace
  if (fs.existsSync(workspacePrettierIgnorePath)) {
    // overwrite the file
    fs.unlinkSync(workspacePrettierIgnorePath);
    console.log(
      `removed existing ".prettierignore" at ${workspacePrettierIgnorePath}`
    );
  }

  fs.copyFileSync(PRETTIER_IGNORE_PATH, workspacePrettierIgnorePath);
  console.log(`copied ".prettierignore" to ${workspacePrettierIgnorePath}`);
}
