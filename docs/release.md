# Releasing

This monorepo uses `nx` and the `nx` plugin `@jscutlery/semver` to manage releases in relevant workspaces.

## How it works

`nx` has this concept of [tasks](https://nx.dev/core-features/run-tasks#run-tasks), which are like npm scripts defined in a `project.json` file.

To be consistent in the `jscutlery/semver` docs, we have defined semantic release target task in the `projects.json` file as `version`.

This can be run with `npx nx run <project>:version` (e.g. `npx nx run app:version`).

To determine the new version, `jscutlery/semver` will look at the git tags on the repo, and look for an existing tag `<project>:<version>` (e.g. `app:1.0.0`). If it finds one, it will increment the version number based on the commit messages since the last release.

### Releases

To release a package, push a commit to `master`. CircleCI will run the `version` task for the workspaces and create a new commit.

### Alpha Releases

To do a beta release, update `npx nx run <project>:version` in CircleCI to `npx nx run app:version --releaseAs=prerelease --preid=alpha`.

If you have a `package.json` in your workspace like so:

```json
{
  "name": "app",
  "productName": "Reactotron",
  "version": "3.0.0-alpha.8"
}
```

And a `project.json` like so:

```json
{
  "name": "app",
  "targets": {
    "version": {
      "executor": "@jscutlery/semver:version",
      "options": {
        "baseBranch": "master",
        "preset": "conventional"
      }
    }
  }
}
```

And you already have an existing git tag `app:3.0.0-alpha.8`, then the `version` task will update the `version` field in the `package.json` to `3.0.0-alpha.9` and create a new git tag `app:3.0.0-alpha.9`.
