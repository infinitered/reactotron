// @ts-check
// #region Parse inputs
const isCi = process.env.CI === "true"
const [_NODE_PATH, _SCRIPT_PATH, ...args] = process.argv
const [gitTag = ""] = args
const [npmWorkspace, version] = gitTag.split("@")
// #endregion

// #region assert tag matches 'app@1.1.1' format
const GIT_TAG_REGEX = /^[a-z0-9-]+@[a-z0-9\.-]+$/ // 'reactotron-app@3.0.0'
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

//#region asserts that $GITHUB_TOKEN environment variable is set
const githubToken = process.env.GITHUB_TOKEN
if (!githubToken) {
  console.error("GITHUB_TOKEN environment variable is required")
  process.exit(1)
}
// #endregion

// #region assert release folder exists
const path = require("path")
const fs = require("fs")

const folder = path.join(__dirname, "..", "/release")

if (!fs.existsSync(folder)) {
  console.error(`Folder '${folder}' does not exist`)
  process.exit(1)
}
console.log(`Found release folder at ${folder}`)
// #endregion

// #region assert release folder is not empty
const files = fs
  .readdirSync(folder)
  // check if file is a directory
  .filter((file) => !fs.lstatSync(path.join(folder, file)).isDirectory())
  // filter out yaml files
  .filter((file) => !file.endsWith(".yml"))
  .filter((file) => !file.endsWith(".yaml"))
  // filter out .blockmap files
  .filter((file) => !file.endsWith(".blockmap"))
if (files.length === 0) {
  console.error(`Folder '${folder}' is empty`)
  process.exit(1)
}
console.log(`Found ${files.length} files to upload`)
console.log(`Files: ${files.join(", ")}`)

// get mimie types
const mime = require("mime")
mime.define({ "application/x-apple-diskimage": ["dmg"] }, true)
files.forEach((file) => {
  const mimeType = mime.getType(file)
  console.log(`File '${file}' has mime type '${mimeType}'`)
})
// #endregion

// #region release on github
const { Octokit } = require("@octokit/rest")
const octokit = new Octokit({ auth: githubToken })

const owner = "infinitered"
const repo = "reactotron"

;(async () => {
  // Get the release by tag
  octokit.repos
    .createRelease({
      owner,
      repo,
      tag_name: gitTag,
      name: gitTag,
      prerelease: gitTag.includes("beta") || gitTag.includes("alpha"),
      draft: !isCi,
      target_commitish: gitTag.includes("beta")
        ? "beta"
        : gitTag.includes("alpha")
        ? "alpha"
        : "master",
    })
    .then(({ data: release }) => {
      Promise.allSettled(
        files.map((file) => {
          console.log(`Uploading '${file}'...`)
          return octokit.repos.uploadReleaseAsset({
            owner,
            repo,
            release_id: release.id,
            name: file,
            headers: {
              "Content-Type": mime.getType(file) || "application/octet-stream",
            },
            // @ts-ignore data is expecting json by default, but we want to send a buffer
            data: fs.readFileSync(path.join(folder, file)),
          })
        })
      ).then((results) => {
        const failed = results.filter((result) => result.status === "rejected")
        if (failed.length > 0) {
          console.error(`Failed to upload ${failed.length} files`)
          failed.forEach((result, index) => {
            console.error(`Failed to upload ${files[index]}`)
            console.error(result)
          })
          process.exit(1)
        }
        console.log(`Successfully uploaded ${files.length} files`)
        process.exit(0)
      })
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
})()
// #endregion
