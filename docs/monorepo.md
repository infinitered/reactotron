# Monorepo

## Yarn 3

This project uses yarn 3 workspaces to manage the monorepo. It hoists dependencies shared across workspaces to the root of the project, and allows for a single `yarn.lock` file to be used for all packages.

As long as you have yarn 1 installed, you will use the yarn 3 automatically using the version specified in `.yarnrc.yml`.

### nodeLinker

Yarn 3 philosophically has chosen to go in a direction where dependencies should be vendored and checked into the repo. This is a departure from the way yarn 1 and npm work, where dependencies are installed in the `node_modules` directory. They call this Plug'n'Play, and it is enabled by default in yarn 3.

However, this can behavior can be modified through the `nodeLinker` value in `yarnrc.yml` to use `node-modules`, which is the normal behavior for yarn 1 and npm.

Since yarn 1 is no longer being actively worked on, so we are using yarn 3 with the `nodeLinker` set to `node-modules`.

### Patches

Yarn 3 has a patching feature similar to `patch-package` through `yarn patch <package>`. You can read more about it here: https://yarnpkg.com/cli/patch

## Nx

This project uses `nx` as a task runner for the monorepo. Nx has many features, including build integration, dependency graph visualization, and more. You can read more about it here: https://nx.dev/

### Tasks

`npx nx run-many` is a common command used to run a command across all workspaces. For example, `npx nx run-many --target=lint` will run the `lint` target in all workspaces. Targets are like npm scripts, but they can be run across multiple workspaces.

These are aliased as yarn scripts in the root `package.json` file. For example, `yarn lint` will run the `lint` target in all workspaces.

### Affected

Nx also has a `affected` command that will run a command on all workspaces that have been affected by a change. For example, `npx nx affected:lint` will run the `lint` target in all workspaces that have been affected by a change.

### project.json

Each workspace needs a `project.json` file to register it with nx. This file is used to define the targets for the workspace, and to define the dependencies between workspaces.

Any script in the `scripts` section of the `package.json` file will be registered as a target in nx. For example, the `lint` script in the `package.json` file will be registered as a target in nx.

Additionally, you can set target defaults in the root `nx.json` file.

### Task Caching

Nx has a feature called task caching that will cache the output of a task. Nx can fingerprint whether a task like `build` has already run and not changed. The cache is stored in the `node_modules/.cache/.nx` directory. If you want to clear the cache, you can delete the `node_modules/.cache/.nx` directory.

## Linting

Eslint allows for having a parent config file and then extending it in child config files. This project has a generic Typescript linting setup at the top, and then child projects can extend it and add their own rules (for React, Electron, etc.). Read more about it here: https://eslint.org/docs/latest/user-guide/configuring/configuration-files

## Typescript

In order for `typescript-eslint` to work, we use a `tsconfig.base.json` in the parent directory, and then each workspace extends that base with it's own `tsconfig.json` file. But in the parent eslint config, you must declare the location of all the tsconfig.json files in a glob pattern. You can read more here: https://typescript-eslint.io/linting/typed-linting/monorepos/#one-tsconfigjson-per-package-and-an-optional-one-in-the-root

### Common Gotchas

In order to prevent nested folders in our `dist` directory, `"rootDir": ".",` needs to be specified in the workspace `tsconfig.json` to avoid the parent `tsconfig.base.json` from being used.

## Prettier

### Ignore file

Prettier has a `.prettierignore` file that is used to ignore files. This file is used in addition to the `.gitignore` file. This is useful for ignoring files that are not checked into git, but still need to be ignored by prettier. Unfortunately, there is no way to extend the `.gitignore` file in the `.prettierignore` file, so we have to duplicate the entries. See `copy-prettier-ignore` in the root `package.json` script.
