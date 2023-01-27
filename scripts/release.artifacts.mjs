#!/usr/bin/env zx
// @ts-check
import "zx/globals";

const isCi = process.env.CI === "true";
const [_NODE_PATH, _ZX_PATH, _SCRIPT_PATH, ...args] = process.argv;
const [gitTag] = args;
const [npmWorkspace, version] = gitTag.split("@");

// #region assert tag matches 'app@1.1.1' format
const GIT_TAG_REGEX = /^[a-z0-9-]+@[a-z0-9\.-]+$/; // 'reactotron-app@3.0.0' | 'reactotron-core-ui@2.0.1'
/** @see https://gist.github.com/jhorsman/62eeea161a13b80e39f5249281e17c39 */
const SEM_VER_REGEX =
  /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/;
if (
  !gitTag ||
  !gitTag.match(GIT_TAG_REGEX) ||
  !npmWorkspace ||
  !version ||
  !version.match(SEM_VER_REGEX)
) {
  console.error(
    `First argument must match format: <workspace>@<version>, got '${gitTag}'`
  );
  process.exit(1);
}
console.log(`Creating release for '${gitTag}'`);

// #endregion

// #region assert GITHUB_TOKEN is set
if (
  typeof process.env.GITHUB_TOKEN !== "string" ||
  process.env.GITHUB_TOKEN === ""
) {
  console.error("GITHUB_TOKEN environment variable is required");
  process.exit(1);
}
// #endregion

// #region assert that workspace exists
const workspaces = await $`yarn workspaces info --json`.quiet();
/** @type {Record<string, any>} */
const workspaceInfo = JSON.parse(workspaces.stdout);
/** @type {string} */
const relativePath = workspaceInfo[npmWorkspace]?.location;
if (!relativePath) {
  console.error(`Workspace '${npmWorkspace}' does not exist`);
  process.exit(1);
}
const npmWorkspacePath = path.join(
  __dirname, // ~/scripts
  "..", // ~/
  relativePath // ~/packages/reactotron-app
);

if (!fs.existsSync(npmWorkspacePath)) {
  console.error(
    `Workspace '${npmWorkspace}' does not exist at '${npmWorkspacePath}'`
  );
  process.exit(1);
}

console.log(`Found workspace '${npmWorkspace}' at '${npmWorkspacePath}'`);
// #endregion

// #region release on npm
const npmTag = gitTag.includes("beta")
  ? "beta"
  : gitTag.includes("alpha")
  ? "alpha"
  : "latest";

console.log(`Creating npm release for: ${gitTag}`);
cd(npmWorkspacePath); // cd to workspace to avoid using --workspace flag https://github.com/npm/cli/issues/5745
await $`npm publish --access public --tag ${npmTag} --dry-run ${!isCi} --registry https://registry.npmjs.org/`;
cd(__dirname);
// #endregion

// #region release on github
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

try {
  const res = await octokit.repos.createRelease({
    owner: "infinitered",
    repo: "reactotron",
    tag_name: gitTag,
    prerelease: version.includes("beta") || version.includes("alpha"),
    target_commitish: version.includes("beta")
      ? "beta"
      : version.includes("alpha")
      ? "alpha"
      : "master",
    draft: !isCi,
  });

  console.log(
    `Created github release for '${gitTag}' at '${res.data.html_url}'`
  );
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  } else {
    console.error("Something went wrong");
    console.error(error);
    process.exit(1);
  }
}
// #endregion
