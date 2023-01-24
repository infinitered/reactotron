#!/usr/bin/env zx
// @ts-check
import "zx/globals";

const [_NODE_PATH, _ZX_PATH, _SCRIPT_PATH, ...args] = process.argv;
const [gitTag] = args;
const isCi = process.env.CI === "true";

// #region assert tag matches 'app@1.1.1' format
if (!gitTag || !gitTag.match(/^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$/)) {
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

// #region release on npm
const npmTag = gitTag.includes("beta")
  ? "beta"
  : gitTag.includes("alpha")
  ? "alpha"
  : "latest";

const [npmWorkspace, version] = gitTag.split("@");

console.log(`Creating npm release for: ${gitTag}`);
$`npm publish --access public --tag ${npmTag} --workspace ${npmWorkspace} --dry-run ${!isCi}`;
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
    generate_release_notes: true,
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
