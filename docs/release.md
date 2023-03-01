# Releasing

## High Level Overview

### Git Tags

Git tags are used to mark a commit for a release. The format of the git tag is `<workspace>@<version>` (e.g. `reactotron-app@3.0.0`).

A release commit and a git tag is created for every affected workspace on a release branch: `master`, `beta`, or `alpha`.

Versions for a workspace are determined by the version in the workspace `package.json.`

```json
{
  "name": "reactotron-app",
  "version": "3.0.0"
}
```

Would correspond to a git tag `reactotron-app@3.0.0`.

### Release Branches

In CI, on every commit to a release branch, a task is run to determine what changed between the current commit and the last commit. If a workspace has changed, then a new release commit and tag will be added to the release branch.

So if 3 workspaces change, then 3 release commits are added to the release branch and 3 git tags are created.

### Releasing Artifacts

When a new git tag is published, CI will build and publish the workspace artifacts for that tag.

As of writing this, we have two workspaces: `apps` and `lib`.

Artifacts from `lib` workspaces are published to npm.

Artifacts from `app` workspaces are published to GitHub releases.

## How Releases Are Implemented

Releases are implemented using:

- [nx](https://nx.dev/getting-started/intro) to manage workspaces and determine which workspaces have changed between commits
- [jscutlery/semver](https://github.com/jscutlery/semver) to bump package.json versions, create release commits, and create git tags
- [CircleCi](https://circleci.com/docs/configuration-reference/) to run the release tasks

## Nx

`nx` has this concept of [tasks](https://nx.dev/core-features/run-tasks#run-tasks), which are like npm scripts defined in a `project.json` file.

To be consistent in the `jscutlery/semver` docs, we have defined semantic release target task in the `projects.json` file as `version`.

This can be run with `npx nx run <project>:version` (e.g. `npx nx run app:version`).

However, normally this will be run using `npx nx affected --target version --parallel=1 --base HEAD~1 --head HEAD`. The [affected](https://nx.dev/concepts/affected) command from `nx` will run the `version` task for the workspaces that have changed between the branches current commit and the last commit.

## `jscutlery/semver`

To determine the new version, `jscutlery/semver` will look at the git tags on the repo, and look for an existing tag `<project>:<version>` (e.g. `app:1.0.0`). If it finds one, it will increment the version number based on the existing git tags.

Settings for this plugin are managed using the `nx.json` and `project.json` files in a workspace.

## CircleCi

CircleCi is used to run the release tasks. The `config.yml` file is located in the `.circleci` folder.

CircleCi is configured to check for whether new release commits and tags are needed on every commit to a release branch: `master`, `beta`, and `alpha`.

Once a new release tag is created, CircleCi will run a job to publish the artifacts for the workspace.
