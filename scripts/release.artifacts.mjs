#!/usr/bin/env zx
// @ts-check
import "zx/globals"
import { getWorkspaceList } from "./tools/workspace.mjs"

const isCi = process.env.CI === "true"
const [_NODE_PATH, _ZX_PATH, _SCRIPT_PATH, ...args] = process.argv
const [gitTag] = args
const [npmWorkspace, version] = gitTag.split("@")

// #region assert tag matches 'app@1.1.1' format
const GIT_TAG_REGEX = /^[a-z0-9-]+@[a-z0-9\.-]+$/ // 'reactotron-app@3.0.0' | 'reactotron-core-ui@2.0.1'
/** @see https://gist.github.com/jhorsman/62eeea161a13b80e39f5249281e17c39 */
const SEM_VER_REGEX =
  /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/
if (
  !gitTag ||
  !gitTag.match(GIT_TAG_REGEX) ||
  !npmWorkspace ||
  !version ||
  !version.match(SEM_VER_REGEX)
) {
  console.error(`First argument must match format: <workspace>@<version>, got '${gitTag}'`)
  process.exit(1)
}
console.log(`Creating release for '${gitTag}'`)

// #endregion

// #region assert GITHUB_TOKEN is set
if (typeof process.env.GITHUB_TOKEN !== "string" || process.env.GITHUB_TOKEN === "") {
  console.error("GITHUB_TOKEN environment variable is required")
  process.exit(1)
}
// #endregion

// #region assert that workspace exists
const workspaces = await getWorkspaceList()
const relativePath = workspaces.find((w) => w.name === npmWorkspace)?.location
if (!relativePath) {
  console.error(`Workspace '${npmWorkspace}' does not exist`)
  process.exit(1)
}
const npmWorkspacePath = path.join(
  __dirname, // ~/scripts
  "..", // ~/
  relativePath // ~/packages/reactotron-app
)

if (!fs.existsSync(npmWorkspacePath)) {
  console.error(`Workspace '${npmWorkspace}' does not exist at '${npmWorkspacePath}'`)
  process.exit(1)
}

console.log(`Found workspace '${npmWorkspace}' at '${npmWorkspacePath}'`)

// Skip private packages (not published to npm)
const workspacePkg = JSON.parse(fs.readFileSync(path.join(npmWorkspacePath, "package.json"), "utf-8"))
if (workspacePkg.private) {
  console.log(`Skipping '${npmWorkspace}' because it is marked as private`)
  process.exit(0)
}
// #endregion

// #region assert npm credentials are set
if (isCi) {
  const hasToken = typeof process.env.NPM_TOKEN === "string" && process.env.NPM_TOKEN !== ""
  const hasOidcToken =
    typeof process.env.NPM_ID_TOKEN === "string" && process.env.NPM_ID_TOKEN !== ""
  if (!hasToken && !hasOidcToken) {
    console.error("Either NPM_TOKEN or NPM_ID_TOKEN environment variable is required")
    process.exit(1)
  }
}
// #endregion

// #region npm OIDC exchange (workaround for yarn 4.14.1 CircleCI gating bug)
/**
 * Yarn 4.14.1's `yarn npm publish` only enables the OIDC code path when one of
 * `GITHUB_ACTIONS` or `GITLAB_CI` is set, even though the underlying
 * `getOidcToken` already handles `CIRCLECI` correctly (see PR yarnpkg/berry#7075).
 * Until the upstream fix lands (https://github.com/yarnpkg/berry/pull/7122),
 * we exchange the OIDC id-token for a single-use npm publish token here and
 * surface it via NPM_TOKEN, which `.yarnrc.yml`'s `npmAuthToken: "${NPM_TOKEN-}"`
 * picks up at config-load time.
 *
 * Endpoint reference (from yarn's own implementation):
 * https://github.com/yarnpkg/berry/blob/7469b9c/packages/plugin-npm/sources/npmHttpUtils.ts#L629
 *
 * Skipped when:
 *   - NPM_TOKEN is already set (caller-supplied; preserves legacy behavior)
 *   - NPM_ID_TOKEN is missing (the assertion above will have failed in CI)
 */
const hasNpmToken = typeof process.env.NPM_TOKEN === "string" && process.env.NPM_TOKEN !== ""
const hasNpmIdToken =
  typeof process.env.NPM_ID_TOKEN === "string" && process.env.NPM_ID_TOKEN !== ""
if (isCi && !hasNpmToken && hasNpmIdToken) {
  // npm exchange endpoint expects POST {registry}/-/npm/v1/oidc/token/exchange/package/{name}
  // with `Authorization: Bearer <id-token>` and an empty body. All reactotron-* packages
  // are unscoped, so the ident path is just `/<name>`.
  const npmRegistry = "https://registry.npmjs.org"
  const exchangeUrl = `${npmRegistry}/-/npm/v1/oidc/token/exchange/package/${npmWorkspace}`

  console.log(`Exchanging NPM_ID_TOKEN for a publish token via ${exchangeUrl}`)

  // Disable zx's verbose mode for this call: zx wraps `fetch` and, when verbose,
  // logs the full `init` — including the `Authorization: Bearer …` header — to
  // stderr. Restore the prior verbosity setting after the call regardless of
  // outcome.
  const previousVerbose = $.verbose
  $.verbose = false

  /** @type {Response} */
  let exchangeResponse
  try {
    exchangeResponse = await fetch(exchangeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NPM_ID_TOKEN}`,
      },
    })
  } catch (error) {
    $.verbose = previousVerbose
    const message = error instanceof Error ? error.message : String(error)
    console.error(`npm OIDC token exchange failed: network error: ${message}`)
    process.exit(1)
  }
  $.verbose = previousVerbose

  if (!exchangeResponse.ok) {
    // Body intentionally omitted from logs — it may include sensitive details.
    console.error(
      `npm OIDC token exchange failed: HTTP ${exchangeResponse.status} ${exchangeResponse.statusText}`
    )
    process.exit(1)
  }

  /** @type {{ token?: string }} */
  let exchangeBody
  try {
    exchangeBody = await exchangeResponse.json()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`npm OIDC token exchange failed: malformed JSON response: ${message}`)
    process.exit(1)
  }

  if (typeof exchangeBody.token !== "string" || exchangeBody.token === "") {
    console.error(`npm OIDC token exchange failed: response did not contain a token`)
    process.exit(1)
  }

  process.env.NPM_TOKEN = exchangeBody.token
  console.log(`Exchanged NPM_ID_TOKEN for a single-use npm publish token`)
}
// #endregion

// #region extract changelog entry for this version
/**
 * Gets the changelog entry for a specific version
 * @param {string} version The version to extract (without '@' prefix)
 * @param {string} workspacePath Path to the workspace directory
 * @returns {string} The formatted changelog entry or a default message
 */
function getChangelogEntry(version, workspacePath) {
  try {
    // Try to find and parse the appropriate CHANGELOG.md file
    const changelogPath = path.join(workspacePath, "CHANGELOG.md")

    // If changelog doesn't exist, return a default message
    if (!fs.existsSync(changelogPath)) {
      console.warn(`No CHANGELOG.md found at ${changelogPath}`)
      return `Release version ${version}. See repository for changes.`
    }

    const changelog = fs.readFileSync(changelogPath, "utf8")

    // Extract the section for this version
    // Match both ## and ### header styles
    const versionHeaderRegex = new RegExp(
      `(?:##|###)\\s*\\[${version}\\][^]*?(?=(?:##|###)\\s*\\[|$)`,
      "s"
    )
    const match = changelog.match(versionHeaderRegex)

    if (!match) {
      console.warn(`No changelog entry found for version ${version}`)
      return `Release version ${version}. See repository for changes.`
    }

    // Return the matching section, excluding the header
    const lines = match[0].split("\n")
    const contentWithoutHeader = lines.slice(1).join("\n").trim()

    // If the changelog entry is empty, try to find accumulated changes
    if (!contentWithoutHeader) {
      console.warn(
        `Empty changelog entry for version ${version}, looking for accumulated changes...`
      )

      // Find previous significant version to compare against
      const allVersionsRegex = /(?:##|###)\s*\[([^\]]+)\]/g
      const versions = []
      let versionMatch

      while ((versionMatch = allVersionsRegex.exec(changelog)) !== null) {
        versions.push(versionMatch[1])
      }

      // Get index of current version
      const currentIndex = versions.indexOf(version)

      if (currentIndex !== -1 && currentIndex < versions.length - 1) {
        // Find previous significant version (with different major or minor)
        const [currentMajor, currentMinor] = version.split(".").map(Number)
        let previousVersion = null

        for (let i = currentIndex + 1; i < versions.length; i++) {
          const ver = versions[i]
          const [major, minor] = ver.split(".").map(Number)

          if (major !== currentMajor || minor !== currentMinor) {
            previousVersion = ver
            break
          }
        }

        if (previousVersion) {
          return `This release includes all changes accumulated since version ${previousVersion}.\n\nSee the [CHANGELOG](https://github.com/infinitered/reactotron/blob/${npmWorkspace}/CHANGELOG.md) for more details.`
        }
      }

      return `Release version ${version}. See repository for changes.`
    }

    return contentWithoutHeader
  } catch (error) {
    console.error(`Error extracting changelog entry: ${error.message}`)
    return `Release version ${version}. See repository for changes.`
  }
}

// Get the release notes for this version
const releaseNotes = getChangelogEntry(version, npmWorkspacePath)
console.log(`Got release notes (${releaseNotes.length} characters)`)
// #endregion

// #region release on npm
if (isCi) {
  const npmTag = gitTag.includes("beta") ? "beta" : gitTag.includes("alpha") ? "alpha" : "latest"

  console.log(`Creating npm release for: ${gitTag}`)
  cd(npmWorkspacePath)
  await $`yarn npm publish --access public --tag ${npmTag}`
  cd(__dirname)
} else {
  console.log("Skipping npm release because this is not a CI build")
}
// #endregion

// #region release on github
const { Octokit } = require("@octokit/rest")

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

try {
  const res = await octokit.repos.createRelease({
    owner: "infinitered",
    repo: "reactotron",
    tag_name: gitTag,
    name: gitTag,
    body: releaseNotes,
    prerelease: version.includes("beta") || version.includes("alpha"),
    target_commitish: version.includes("beta")
      ? "beta"
      : version.includes("alpha")
        ? "alpha"
        : "master",
    draft: !isCi,
  })

  console.log(`Created github release for '${gitTag}' at '${res.data.html_url}'`)
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
    process.exit(1)
  } else {
    console.error("Something went wrong")
    console.error(error)
    process.exit(1)
  }
}
// #endregion
